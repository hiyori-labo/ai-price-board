"""
各社の公式料金ページを取得して前回スナップショットと比較し、変化を検知する。
変化があれば Discord Webhook に通知し、スナップショットを更新する。

- スナップショットは snapshots/ ディレクトリにテキストで保存(リポジトリにコミットされる)
- 通知先は環境変数 DISCORD_WEBHOOK_URL(GitHub Secrets で設定)
- 本文のみ抽出(タグ除去)して比較 → 見た目上の本質的な変化だけを見る設計(壊れにくい工夫)
"""

import hashlib
import json
import os
import re
import sys
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# 監視対象(data.js 内 PRICING_DATA の pricing_url と合わせておく)
TARGETS = [
    {"name": "Anthropic", "url": "https://claude.com/pricing"},
    {"name": "OpenAI",    "url": "https://openai.com/api/pricing/"},
    {"name": "Google",    "url": "https://ai.google.dev/gemini-api/docs/pricing"},
    {"name": "xAI",       "url": "https://x.ai/api"},
]

SNAP_DIR = Path("snapshots")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ai-price-board-watch/1.0; personal price monitor)"
}


def normalize(html: str) -> str:
    """HTMLから本文テキストを抽出して正規化(空白・スクリプトなどのノイズを除去)"""
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript", "svg"]):
        tag.decompose()
    text = soup.get_text(separator=" ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def snapshot_path(name: str) -> Path:
    return SNAP_DIR / f"{name.lower()}.txt"


def notify_discord(changes: list[dict]) -> None:
    webhook = os.environ.get("DISCORD_WEBHOOK_URL", "").strip()
    if not webhook:
        print("DISCORD_WEBHOOK_URL 未設定のため通知はスキップ")
        return
    lines = ["**料金ページに変化を検知しました**"]
    for c in changes:
        lines.append(f"- {c['name']}: {c['url']}")
    lines.append("data.js の料金を確認・更新してください。")
    resp = requests.post(webhook, json={"content": "\n".join(lines)}, timeout=15)
    resp.raise_for_status()
    print("Discord に通知しました")


def main() -> int:
    SNAP_DIR.mkdir(exist_ok=True)
    changes = []
    errors = []

    for t in TARGETS:
        try:
            resp = requests.get(t["url"], headers=HEADERS, timeout=30)
            resp.raise_for_status()
            current = normalize(resp.text)
        except Exception as e:
            # 取得失敗は、変化とは区別してログに残すだけ(誤通知を防ぐ)
            errors.append(f"{t['name']}: {e}")
            print(f"[WARN] {t['name']} の取得に失敗: {e}")
            continue

        path = snapshot_path(t["name"])
        previous = path.read_text(encoding="utf-8") if path.exists() else None

        if previous is None:
            path.write_text(current, encoding="utf-8")
            print(f"[INIT] {t['name']} の初回スナップショットを保存")
        elif hashlib.sha256(previous.encode()).hexdigest() != hashlib.sha256(current.encode()).hexdigest():
            path.write_text(current, encoding="utf-8")
            changes.append(t)
            print(f"[CHANGE] {t['name']} に変化あり")
        else:
            print(f"[OK] {t['name']} 変化なし")

    if changes:
        notify_discord(changes)

    # GitHub Actions のステップサマリーへ出力
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as f:
            f.write("## 料金ページ監視結果\n\n")
            if changes:
                f.write("### 変化あり\n" + "\n".join(f"- {c['name']}" for c in changes) + "\n")
            else:
                f.write("変化なし\n")
            if errors:
                f.write("\n### 取得エラー\n" + "\n".join(f"- {e}" for e in errors) + "\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())
