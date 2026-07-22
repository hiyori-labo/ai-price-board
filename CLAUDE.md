# CLAUDE.md — AI API 料金ボード

## プロジェクト概要

ChatGPT / Gemini / Claude / Grok のAPI料金を一覧比較する静的サイト。
GitHub Pagesで公開: https://ai-price.hiyori-labo.com/

- 料金データは `data.js` の `PRICING_DATA`(JSON)で手動管理
- GitHub Actions(`price-watch.yml`)が毎朝6時(JST)に各社の料金ページを取得し、
  変化があればDiscordに通知 + `snapshots/` を更新してコミットする
- 料金の自動抽出はしない設計(壊れにくさ優先)。更新は人間+AIの判定で行う

## ファイル構成

- `index.html` — サイト本体(HTML/CSS/JS)。`<script src="data.js">` で料金データを読み込む
- `data.js` — 料金データ `PRICING_DATA`。**価格改定時はこのファイルだけ編集すればOK**
- `ogp.png` — OGP画像
- `favicon.svg` — ファビコン
- `watch_prices.py` — 料金ページ監視スクリプト
- `snapshots/*.txt` — 各社料金ページの本文スナップショット(正規化済みテキスト)
- `.github/workflows/price-watch.yml` — 監視の定期実行
- `CNAME` — カスタムドメイン設定。**絶対に削除しない**

## 定型タスク: botの通知が来たときのdiff判定

「diff見て」「通知来た」等と言われたら、以下を実行する:

1. `git fetch origin` して、origin/mainの `chore: update pricing page snapshots` コミットを取得
2. `snapshots/` の差分を**単語レベル**で確認する。ファイルは1行の長大テキストなので、
   `git diff --word-diff` か、Pythonの `difflib.SequenceMatcher`(単語分割)を使う
3. 差分を以下のどちらかに判定して報告する:
   - **料金変更(本物)**: 単価($表記)、モデル名の追加/削除、コンテキスト長などの変化
   - **空振り**: キャンペーン文言、FAQ追加、タイトルや導線の文言変更、日付などの変化
4. 本物だった場合:
   - Web検索等で公式情報を裏取りする
   - `data.js` の `PRICING_DATA` の更新案を提示する(勝手にコミットせず、まず提案)
   - 更新時は `last_updated` も今日の日付に変える

### 過去の空振り例(参考)

- Anthropic: 料金ページにプランFAQセクションが追加された(単価変更なし)
- OpenAI: ページタイトルの「ChatGPT」→「Business」の1単語変更
- xAI: 社名表記が「xAI Corp.」→「X.AI LLC」に変更(2026-07)
- Anthropic: 教育メニューが「Education」→「Higher education / K-12 teachers」に分割、
  K-12向けの規約リンク追加(2026-07)
- Anthropic: ナビのDepartmentsメニューで「Security」→「Cybersecurity」に改名、
  Company sizeの項目順が入れ替わった(2026-07)
- OpenAI: フッターの「More Stories」導線に「Supply Co.」リンクが追加(2026-07)
- xAI: 「Latest news」フィードに新着記事(例: Grok Build is Now Open Source)が
  追加され、古い記事が押し出される。ニュース見出しの更新は毎回起きる想定(2026-07)

## PRICING_DATA の編集ルール

- 単価はすべて **USD / 100万トークン(標準レート)** に正規化して格納する
  (公式が1Kトークン単位で表記していても換算する)
- バッチ割引・キャッシュ割引は含めない。例外的な料金体系は `notes` に日本語で書く
- モデル廃止時は削除せず `"deprecated": true` にする
- 各モデルのキーは `id` / `name` / `input_per_mtok` / `output_per_mtok` /
  `context_window` / `notes` / `deprecated` の7つ。既存行の形に揃える
- `context_window` が公式で確認できない場合は `null` か推定値を入れ、
  `notes` に「コンテキスト長は要公式確認」と書く
- `tier` フィールドは**現在使っていない**(index.html 側にも描画ロジックなし)。
  復活させるなら全モデルにまとめて付けること。新モデルにだけ付けない

## 監視対象URLについて

- `watch_prices.py` の `TARGETS` と `data.js` の各 `pricing_url` は揃えておく
- OpenAIは `openai.com/api/pricing/` がサブスクプラン紹介ページに転送されるため、
  APIトークン単価は `https://developers.openai.com/api/docs/pricing` を監視する

## 開発時の注意

- コミットメッセージに `$` を含めるときは**シングルクォート**で囲む
  (ダブルクォートだと `$1.50` の `$1` がシェル変数展開されて消える。過去に発生済み)
- push前に `git pull` する(botがsnapshotsをコミットしていることがある)
- `CNAME` ファイルと `snapshots/` はbot運用に必要。整理・削除しない
- DiscordのWebhook URLとAPIキーは絶対にコミットしない(GitHub Secretsで管理)
- サイトは素の静的ファイル構成(`index.html` + `data.js`)を維持する。
  ビルドツールやフレームワークは導入しない
