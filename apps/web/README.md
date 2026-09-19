# World Gallery Web

World Galleryの公開サイトです。Next.js App Router、TypeScript、Sanity、react-globe.glを使用しています。

プロジェクト全体のセットアップと環境変数は、リポジトリルートの[`README.md`](../../README.md)を参照してください。

## 起動

```bash
cp .env.example .env.local
npm ci
npm run dev
```

<http://localhost:3000/ja>を開きます。

## コマンド

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run test       # Vitest
npm run build      # 本番ビルド
npm run start      # ビルド済みアプリを起動
```

## Vercel

VercelのRoot Directoryは`apps/web`です。本番用の秘密値はVercel Environment Variablesへ設定し、`.env.local`をGitへ追加しないでください。

運用と復旧は[`docs/operations-ja.md`](../../docs/operations-ja.md)を参照してください。
