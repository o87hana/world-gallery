# World Gallery

Hana Murakamiの作品を場所と結び付け、3D地球儀とGalleryから閲覧できる日英対応ポートフォリオです。作品はSanity Studioから追加・編集し、Next.jsの公開サイトをVercelで配信します。

- 公開サイト: <https://world-gallery-hana-murakamis-projects.vercel.app/>
- Sanity Studio: <https://world-gallery-studio.sanity.studio/>
- 編集者向け資料: [`docs/editor-guide-ja.md`](docs/editor-guide-ja.md)
- 管理・復旧手順: [`docs/operations-ja.md`](docs/operations-ja.md)

## 構成

```text
apps/
  web/                     Next.js公開サイト
  world-gallery-studio/    Sanity StudioとCMSスキーマ
docs/                      編集者・運用資料
```

公開サイトは、地球儀、Gallery、作品詳細、About、Contact、Preview Modeを提供します。SanityのProject IDは`kmx5m7v5`、datasetは`production`です。

## 必要環境

- Node.js 24（`.nvmrc`を使用）
- npm
- Sanityプロジェクトへのアクセス権（Studioを編集する場合）
- Vercelプロジェクトへのアクセス権（デプロイ・環境変数を操作する場合）

```bash
nvm use
```

Node.js 24が未導入の場合は、利用中のNodeバージョン管理ツールで先にインストールしてください。

## ローカルセットアップ

### Web

```bash
cd apps/web
cp .env.example .env.local
npm ci
npm run dev
```

ブラウザで<http://localhost:3000/ja>を開きます。`.env.local`の必要値は後述の環境変数表を参照してください。

Vercelにリンク済みの場合は、手入力の代わりに次の方法も使用できます。`vercel env pull`は対象ファイルを上書きするため、既存のローカル設定を退避してから実行してください。

```bash
cd apps/web
vercel env pull .env.local --environment=development
```

### Sanity Studio

```bash
cd apps/world-gallery-studio
npm ci
npm run dev
```

表示されたローカルURLを開き、Sanityアカウントでログインします。

## 環境変数

テンプレートは[`apps/web/.env.example`](apps/web/.env.example)にあります。実値を入れた`.env.local`はGitへ追加しないでください。

| 変数 | 公開範囲 | 用途 | 必要になる機能 |
|---|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ブラウザ公開 | Sanity Project ID | 常時 |
| `NEXT_PUBLIC_SANITY_DATASET` | ブラウザ公開 | Sanity dataset | 常時 |
| `NEXT_PUBLIC_SANITY_API_VERSION` | ブラウザ公開 | Sanity APIバージョン | 常時 |
| `SANITY_API_READ_TOKEN` | サーバー秘密 | Draftを読むViewerトークン | Preview |
| `PREVIEW_SECRET` | サーバー秘密 | Preview開始URLの認証 | Preview |
| `SANITY_REVALIDATE_SECRET` | サーバー秘密 | Sanity Webhookの署名検証 | Webhook再検証 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ブラウザ公開 | Turnstileウィジェット | Contact |
| `TURNSTILE_SECRET_KEY` | サーバー秘密 | Turnstile検証 | Contact |
| `RESEND_API_KEY` | サーバー秘密 | メール送信 | Contact |
| `CONTACT_TO_EMAIL` | サーバー秘密 | 問い合わせ受信先 | Contact |
| `CONTACT_FROM_EMAIL` | サーバー秘密 | Resendで認証済みの送信元 | Contact |
| `SANITY_API_WRITE_TOKEN` | ローカル限定秘密 | サンプル投入 | seed実行時のみ |

`NEXT_PUBLIC_`で始まる値はブラウザへ含まれます。APIトークン、secret、メール送信キーにはこの接頭辞を付けません。`SANITY_API_WRITE_TOKEN`は通常運用やVercelには設定せず、必要なseed作業後に失効させます。

## 品質確認

### Web

```bash
cd apps/web
npm run lint
npm run typecheck
npm run test
npm run build
```

### Studio

```bash
cd apps/world-gallery-studio
npm run lint
npm run typecheck
npm run build
```

GitHub Actionsでも、Pull Requestと`main`へのpush時にWeb／Studioの監査・lint・型チェック・テスト・ビルドを実行します。

## Preview Mode

Preview開始URLは次の形式です。

```text
/api/preview?secret=<PREVIEW_SECRET>&slug=<作品slug>&lang=ja
```

- `lang`は`ja`または`en`
- Previewには`SANITY_API_READ_TOKEN`と`PREVIEW_SECRET`が必要
- Preview URLには秘密値が含まれるため、公開資料やIssueへ貼らない
- 確認後は画面の`Exit preview`から終了する

## CMS公開時の注意

公開にはSanityの`Publish`と、作品フィールドの`Published: ON`の両方が必要です。

公開データはSanity CDNとNext.js Data Cacheを使用し、地球儀、Gallery、作品詳細、sitemapごとのタグを付けて1時間ごとに再検証します。Preview Modeはキャッシュを使わず、常にSanityのDrafts APIから取得します。再検証中の取得失敗では直前の成功データを維持し、初回取得自体が失敗した場合は各言語ルートのerror UIで扱います。

Sanity Webhookは本番の`POST /api/revalidate`へ接続済みです。公開済みWorkの作成・更新・削除時に、地球儀、Gallery、作品詳細、sitemapのキャッシュを自動で再検証します。Webhookが一時的に失敗した場合も、1時間ごとの再検証がフォールバックとして動作します。

## デプロイと復旧

- WebのVercel Root Directory: `apps/web`
- Studioのソース: `apps/world-gallery-studio`
- Sanity Studio公開: `npm run deploy`
- 本番環境変数はVercel Dashboardで設定し、Gitへ保存しない
- 環境変数を変更した場合は新しいデプロイへ反映する

通常の公開、ロールバック、障害切り分けは[`docs/operations-ja.md`](docs/operations-ja.md)を参照してください。

## 関連資料

- [`definition.md`](definition.md) — 最終要件
- [`docs/editor-guide-ja.md`](docs/editor-guide-ja.md) — 作品編集者向けガイド
- [`docs/client-meeting-brief-ja.md`](docs/client-meeting-brief-ja.md) — クライアント会議資料
- [`docs/operations-ja.md`](docs/operations-ja.md) — 開発・公開・復旧手順
