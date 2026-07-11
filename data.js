/* =====================================================
   料金データ(価格改定時はこのファイルだけ編集すればOK)
   単価は USD / 1,000,000 トークン(標準レート)
   index.html から <script src="data.js"> で読み込まれる
   ===================================================== */
const PRICING_DATA = {
  "last_updated": "2026-07-11",
  "providers": [
    {
      "id": "anthropic", "name": "Anthropic",
      "pricing_url": "https://claude.com/pricing",
      "models": [
        { "id": "claude-fable-5",    "name": "Claude Fable 5",    "input_per_mtok": 10.0, "output_per_mtok": 50.0, "context_window": 1000000, "notes": "", "deprecated": false },
        { "id": "claude-opus-4-8",   "name": "Claude Opus 4.8",   "input_per_mtok": 5.0,  "output_per_mtok": 25.0, "context_window": 1000000, "notes": "Fastモードは2倍料金", "deprecated": false },
        { "id": "claude-opus-4-6",   "name": "Claude Opus 4.6",   "input_per_mtok": 5.0,  "output_per_mtok": 25.0, "context_window": 1000000, "notes": "旧世代Opus", "deprecated": false },
        { "id": "claude-sonnet-5",   "name": "Claude Sonnet 5",   "input_per_mtok": 2.0,  "output_per_mtok": 10.0, "context_window": 1000000, "notes": "2026/8/31まで導入価格。以降 $3/$15", "deprecated": false },
        { "id": "claude-sonnet-4-6", "name": "Claude Sonnet 4.6", "input_per_mtok": 3.0,  "output_per_mtok": 15.0, "context_window": 1000000, "notes": "", "deprecated": false },
        { "id": "claude-haiku-4-5",  "name": "Claude Haiku 4.5",  "input_per_mtok": 1.0,  "output_per_mtok": 5.0,  "context_window": 200000,  "notes": "", "deprecated": false }
      ]
    },
    {
      "id": "openai", "name": "OpenAI",
      "pricing_url": "https://openai.com/api/pricing/",
      "models": [
        { "id": "gpt-5.6-sol",   "name": "GPT-5.6 Sol",   "input_per_mtok": 5.0,  "output_per_mtok": 30.0, "context_window": 1050000, "notes": "最上位ティア。キャッシュ入力$0.5", "deprecated": false },
        { "id": "gpt-5.6-terra", "name": "GPT-5.6 Terra", "input_per_mtok": 2.5,  "output_per_mtok": 15.0, "context_window": 1050000, "notes": "バランス型ティア。キャッシュ入力$0.25", "deprecated": false },
        { "id": "gpt-5.6-luna",  "name": "GPT-5.6 Luna",  "input_per_mtok": 1.0,  "output_per_mtok": 6.0,  "context_window": 1050000, "notes": "軽量ティア。キャッシュ入力$0.1", "deprecated": false },
        { "id": "gpt-5.5",      "name": "GPT-5.5",      "input_per_mtok": 5.0,  "output_per_mtok": 30.0, "context_window": 1000000, "notes": "272K超の入力は入力2倍・出力1.5倍", "deprecated": false },
        { "id": "gpt-5.4",      "name": "GPT-5.4",      "input_per_mtok": 2.5,  "output_per_mtok": 15.0, "context_window": 1000000, "notes": "長コンテキストは別レート", "deprecated": false },
        { "id": "gpt-5.4-nano", "name": "GPT-5.4 nano", "input_per_mtok": 0.20, "output_per_mtok": 1.25, "context_window": 1000000, "notes": "", "deprecated": false }
      ]
    },
    {
      "id": "google", "name": "Google",
      "pricing_url": "https://ai.google.dev/gemini-api/docs/pricing",
      "models": [
        { "id": "gemini-3.1-pro",   "name": "Gemini 3.1 Pro",   "input_per_mtok": 2.0,  "output_per_mtok": 12.0, "context_window": 2000000, "notes": "200K超は $4/$18 に上昇", "deprecated": false },
        { "id": "gemini-3.5-flash", "name": "Gemini 3.5 Flash", "input_per_mtok": 1.5,  "output_per_mtok": 9.0,  "context_window": 1000000, "notes": "コンテキスト長は要公式確認", "deprecated": false },
        { "id": "gemini-2.5-flash-lite", "name": "Gemini 2.5 Flash-Lite", "input_per_mtok": 0.10, "output_per_mtok": 0.40, "context_window": 1000000, "notes": "", "deprecated": false }
      ]
    },
    {
      "id": "xai", "name": "xAI",
      "pricing_url": "https://x.ai/api",
      "models": [
        { "id": "grok-4.5",      "name": "Grok 4.5",      "input_per_mtok": 2.0,  "output_per_mtok": 6.0,  "context_window": 500000,  "notes": "キャッシュ入力$0.5/M。200K超は別レート(要確認)", "deprecated": false },
        { "id": "grok-4.3",      "name": "Grok 4.3",      "input_per_mtok": 1.25, "output_per_mtok": 2.50, "context_window": null,    "notes": "コンテキスト長は要公式確認", "deprecated": false },
        { "id": "grok-4.1-fast", "name": "Grok 4.1 Fast", "input_per_mtok": 0.20, "output_per_mtok": 0.50, "context_window": 2000000, "notes": "", "deprecated": false }
      ]
    }
  ]
};
