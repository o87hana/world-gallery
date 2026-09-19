# World Gallery Sanity Studio

World Galleryの作品を管理するSanity Studioです。

- Project ID: `kmx5m7v5`
- Dataset: `production`
- 公開Studio: <https://world-gallery-studio.sanity.studio/>

編集操作は[`docs/editor-guide-ja.md`](../../docs/editor-guide-ja.md)、プロジェクト全体のセットアップは[`README.md`](../../README.md)を参照してください。

## 起動

```bash
npm ci
npm run dev
```

## 検証

```bash
npm run lint
npm run typecheck
npm run build
```

## Studioを公開

Sanityへログイン済みの管理者が実行します。

```bash
npm run deploy
```

## サンプルデータ

seedは通常運用では使用しません。書き込み前に必ずdry-runで対象Project IDとdatasetを確認します。

```bash
npm run seed:samples:dry-run
npm run seed:samples
```

書き込みには`apps/web/.env.local`内の`SANITY_API_WRITE_TOKEN`が必要です。作業後はEditorトークンを失効し、通常のPreviewにはViewerトークンだけを使用してください。
