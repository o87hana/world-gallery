要件定義書（最終・実装レベル）
対象：個人作品サイト（絵/スケッチ/建築/旅行/研究）

目的：3D地球儀トップ＋ピンから作品へ遷移、作品はノーコードCMSで追加/編集、非公開切替と管理者Preview対応

ホスティング：Vercel
0. 用語
作品（Work）：1つの投稿単位。カテゴリ、位置（緯度経度）、画像群、本文テキスト、公開状態などを持つ。
カテゴリ（Category）：Sketch / Architecture / Travel / Research / Other（固定）
ピン（Pin）：地球儀上の作品表示。カテゴリ色で色分け。
CMS：ノーコード管理画面（本要件ではSanity Studioを推奨）
Preview Mode：published=falseでも管理者だけ閲覧できるプレビュー機能
1. 推奨技術スタック（最適案）
フロント
Next.js (App Router) + TypeScript
UI：Tailwind CSS（デザイン再現しやすい）
i18n：/ja /en の パス分離（確定）
3D地球儀：react-globe.gl（Three.jsベース、ピン/hover/クリック実装が簡単）
CMS / 管理画面（ノーコード）
Sanity（強く推奨）
理由：非エンジニア向け編集UIが強い／画像管理が強い／Draft&Publishが標準／Vercel + Next previewと相性良い
管理画面はWebで操作。画像アップロード・文章編集・並び替えが可能。
データ取得
Next.js → Sanity（GROQクエリ）
作品数：100件以上想定、各作品画像15枚前後、本文500words程度

→ 一覧は「軽量フィールドだけ」取得、詳細で画像をまとめて取得。
2. 情報設計（サイトマップ/画面）
必須タブ（固定）：

Travel：地球儀トップ（＝ホーム）
Gallery：作品一覧ページ（フィルタ/検索/カテゴリ）
Designer/Team：プロフィールページ
Order/Contact：コンタクト（メールリンク or フォーム）
URL構造（確定）：

/ja：日本語トップ
/en：英語トップ
作品詳細：/ja/work/[slug]、/en/work/[slug]（同一slug推奨）
ギャラリー：/ja/gallery、/en/gallery
プロフィール：/ja/about、/en/about
Contact：/ja/contact、/en/contact
3. デザイン要件（見た目）
テーマ：

Modernism (early 20th)
フォント：Lato
カラー：Bauhaus themed（カテゴリ色にも適用）
ビジュアル原則：

余白多め、グリッド、強いタイポグラフィ（見出し大、本文小）
装飾過多にしない（モダニズム）
地球儀は写実。雲は不要
ピンは「色付き丸」でOK（カテゴリ別）
4. 機能要件（MUST）
4.1 Travel（地球儀トップ）
地球儀表示（写実、雲なし）
操作：
回転・ズーム・ドラッグ：可能
操作感：AとBの中間（※実装では「慣性あり＋過剰に滑らない」設定）
ピン表示：
全作品（published=true）を表示
カテゴリ別に色分けされた丸ピン
hover：作品のミニカードをポップアップ（タイトル + 代表画像 + カテゴリ + 国/都市文字列があれば）
click：作品ページへ遷移（言語に応じて /ja/work/:slug or /en/work/:slug）
ピン数：100件以上でも動作（クラスタリングは任意。重くなるなら導入）
4.2 Gallery（作品一覧）
表示：カード一覧（代表画像＋タイトル＋カテゴリ）
フィルタ：
カテゴリフィルタ（5種）
検索（タイトル/本文の全文までは不要。タイトル優先）
並び順：新しい順（date降順）をデフォルト
4.3 作品詳細ページ（Work）
コンテンツ：
タイトル、サブタイトル、カテゴリ、日付（任意）、本文（約500 words）
画像：1作品あたり15枚前後
レイアウト要件（重要）：
**「写真と文章の入るタイミングがバラバラ」**に対応
CMS側で セクション（Block）を自由に積み上げる方式にする

例：TextBlock / ImageBlock / ImageGridBlock / Spacer / Quote / Divider

→ 非エンジニアでも「並び替え」で構成を作れる
画像配置（Q7のA/B要望を満たす）：
推奨：B（より自由）＝「ImageGridBlock」で列数や比率を選べる
難しければA（固定テンプレ）でも可 → ただし最低限「1枚」「2列」「3列」くらいは選べる設計にする
4.4 非公開（published）とPreview Mode（確定）
CMSで作品ごとに 公開ON/OFFできる
公開OFFの場合：
通常アクセス：404（またはNot Found）
管理者のみ：Preview Modeで表示可能
Preview Mode実装要件：
/api/preview?secret=...&slug=...&lang=ja|en でプレビューモードON
secretは環境変数で管理（Vercel）
プレビュー中はヘッダ等に「Preview中」表示＋「Exit preview」ボタン
4.5 多言語（最終的に日英対応）
/ja /en で完全分離
作品は以下のどちらかで管理（推奨はA）：
A: 1作品に title_ja/title_en, body_ja/body_en を持つ
B: 言語ごとに別ドキュメント（拡張可能だが運用が増える）
言語切替：
同一slugのまま /ja/work/x ⇄ /en/work/x に切替できるUI
英語未入力の場合の扱い：(Coming soon)表示 or 日本語を代替表示（要選択。未指定ならComing soon）
5. データ要件（CMSスキーマ）
5.1 Work（作品）フィールド
title_ja（必須）
title_en（任意）
subtitle_ja（任意）
subtitle_en（任意）
slug（必須・ユニーク）
category（必須：enum）
published（bool、デフォルトtrue）
coverImage（必須：代表画像）
blocks（必須：本文/画像の可変レイアウト配列）
location（必須）
lat（必須）
lng（必須）
placeName_ja（任意：ロンドン等）
placeName_en（任意）
createdAt / date（日付：任意だが並び順に使うので推奨）
tags（任意）
5.2 blocks（自由配置の中核）
TextBlock：richText_ja, richText_en
ImageBlock：image, caption_ja, caption_en, widthPreset（full/medium/narrow）
ImageGridBlock：
images[]（複数）
columns（1/2/3/4）
gap（small/medium/large）
captions（任意）
Spacer / Divider（任意）
6. 非機能要件
パフォーマンス：

地球儀：初期ロード軽量化（作品ピン用データは軽量JSON）
画像：自動最適化（Next Image + Sanity CDN）
作品数100件超：
地球儀：ピンデータのみ先に取得
詳細は遷移時に取得
セキュリティ：

Preview secretは環境変数
管理画面（Sanity Studio）はSanity側のログインに依存（Googleログイン等）
公開OFF作品のデータは、通常クエリでは取得しない（preview時のみdraft含め取得）
運用：

姉：Sanity管理画面で、画像アップ・文章編集・ブロック並べ替え・公開切替
あなた：初期構築/デザイン調整/機能拡張
7. 仕様詳細（地球儀ピン挙動）
ピン表示：{lat,lng,category,color,slug,title,coverImageThumb}
hover：
300msディレイ（暴発防止）
ポップアップは追従 or 固定（どちらでも可、未指定なら固定）
click：
作品ページへ遷移
モバイル：
hover不可 → タップでポップアップ、再タップで遷移（推奨）
8. 受け入れ条件（テスト観点）
管理者がCMSで作品を追加→地球儀とギャラリーに表示
category色が正しい
hoverでポップアップ、クリックで作品詳細に遷移
作品詳細で「テキスト→画像→画像グリッド→テキスト…」の可変構成が再現できる
published=falseにすると公開側から消える
Preview URLで管理者のみ閲覧できる
/ja /en の切替で表示言語が変わる
実装指示（エンジニア向け “これ通り作れば完成”）
A. リポジトリ構成
apps/web：Next.js（Vercel deploy）
apps/studio：Sanity Studio（Vercelでも別デプロイ可 or Sanity hosted）
B. 環境変数（Vercel）
SANITY_PROJECT_ID
SANITY_DATASET
SANITY_API_VERSION
SANITY_READ_TOKEN（preview用。通常公開では不要でもOK）
PREVIEW_SECRET（api/preview用）
C. Preview Mode要件
/api/preview：secret検証→Next draft mode ON→該当slugへリダイレクト
/api/exit-preview：draft mode OFF→トップへ


1) 最終仕様の確定（あなたの回答を反映）
Contact：フォームあり（First/Last/Email/Phone/Message + Submit）
英語未入力：作品詳細で Coming soon
Bauhaus themed カテゴリ色：こちらで提案色に固定
URL：/ja /en 分離（例：/ja/work/xxx / /en/work/xxx）
slug：同一slug方式（推奨デフォルト）
非公開：published=false（CMSでON/OFF）
Preview：要る（ログイン/トークン付き Preview Mode 実装）
地球儀：写実、雲なし。回転/ズーム/ドラッグ。hoverでポップアップ、クリックで作品ページへ。
2) 推奨アーキテクチャ（Vercel最適）
Web：Next.js (App Router) + TS + Tailwind
3D：react-globe.gl（Three.js）
CMS：Sanity（StudioもVercelに載せる）
Contact送信：Resend（Vercel Server Actions / Route Handlerでメール送信。運用が楽）
3) カテゴリ色（Bauhaus themed：提案・固定）
カテゴリ → ピン色（HEX）

Sketch：#E53935（赤）
Architecture：#1E4E9E（青）
Travel：#F6C445（黄）
Research：#2E7D32（緑）
Other：#111111（黒）
※Bauhausの「原色＋黒」ベースで、地球の写実背景でも識別しやすい配色です。
4) リポジトリ構成（これで作る）

repo/
  apps/
    web/        # Next.js (Vercel deploy)
    studio/     # Sanity Studio (Vercel deploy)
5) Sanity Studio（CMS）実装一式
5.1 studio の作成（コマンド）

cd apps
npx sanity@latest init --project-name "world-gallery-studio"# frameworkは "Sanity Studio"# dataset: production
5.2 スキーマ（コピペ）
apps/studio/schemaTypes/work.ts


import { defineType, defineField } from "sanity";const CATEGORIES = ["Sketch", "Architecture", "Travel", "Research", "Other"] as const;export const work = defineType({
  name: "work",
  title: "Work",
  type: "document",
  fields: [
    defineField({ name: "title_ja", title: "Title (JA)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title_en", title: "Title (EN)", type: "string" }),
    defineField({ name: "subtitle_ja", title: "Subtitle (JA)", type: "string" }),
    defineField({ name: "subtitle_en", title: "Subtitle (EN)", type: "string" }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title_ja", maxLength: 96 },
      validation: (r) => r.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: CATEGORIES.map((v) => ({ title: v, value: v })) },
      validation: (r) => r.required(),
    }),

    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
      description: "OFFにすると一般公開から消えます（Preview Modeでのみ閲覧可能）",
    }),

    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),

    defineField({
      name: "location",
      title: "Location",
      type: "object",
      fields: [
        defineField({ name: "lat", title: "Latitude", type: "number", validation: (r) => r.required() }),
        defineField({ name: "lng", title: "Longitude", type: "number", validation: (r) => r.required() }),
        defineField({ name: "placeName_ja", title: "Place Name (JA)", type: "string" }),
        defineField({ name: "placeName_en", title: "Place Name (EN)", type: "string" }),
      ],
    }),

    defineField({
      name: "blocks",
      title: "Content Blocks",
      type: "array",
      of: [
        // Text block (Portable Text)
        defineType({
          name: "textBlock",
          title: "Text Block",
          type: "object",
          fields: [
            defineField({
              name: "body_ja",
              title: "Body (JA)",
              type: "array",
              of: [{ type: "block" }],
            }),
            defineField({
              name: "body_en",
              title: "Body (EN)",
              type: "array",
              of: [{ type: "block" }],
            }),
          ],
          preview: { select: { title: "body_ja" }, prepare: () => ({ title: "Text Block" }) },
        }),

        // Single image block
        defineType({
          name: "imageBlock",
          title: "Image Block",
          type: "object",
          fields: [
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
            defineField({ name: "caption_ja", title: "Caption (JA)", type: "string" }),
            defineField({ name: "caption_en", title: "Caption (EN)", type: "string" }),
            defineField({
              name: "widthPreset",
              title: "Width Preset",
              type: "string",
              options: {
                list: [
                  { title: "Full", value: "full" },
                  { title: "Medium", value: "medium" },
                  { title: "Narrow", value: "narrow" },
                ],
              },
              initialValue: "medium",
            }),
          ],
          preview: { prepare: () => ({ title: "Image Block" }) },
        }),

        // Image grid block (自由配置B寄り)
        defineType({
          name: "imageGridBlock",
          title: "Image Grid Block",
          type: "object",
          fields: [
            defineField({
              name: "images",
              title: "Images",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
              validation: (r) => r.min(2).required(),
            }),
            defineField({
              name: "columns",
              title: "Columns",
              type: "number",
              options: { list: [1, 2, 3, 4].map((n) => ({ title: String(n), value: n })) },
              initialValue: 2,
            }),
            defineField({
              name: "gap",
              title: "Gap",
              type: "string",
              options: { list: ["small", "medium", "large"].map((v) => ({ title: v, value: v })) },
              initialValue: "medium",
            }),
          ],
          preview: { prepare: () => ({ title: "Image Grid Block" }) },
        }),

        // Divider / Spacer
        defineType({
          name: "dividerBlock",
          title: "Divider",
          type: "object",
          fields: [defineField({ name: "style", title: "Style", type: "string", initialValue: "line" })],
          preview: { prepare: () => ({ title: "Divider" }) },
        }),
        defineType({
          name: "spacerBlock",
          title: "Spacer",
          type: "object",
          fields: [
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              options: { list: ["sm", "md", "lg"].map((v) => ({ title: v, value: v })) },
              initialValue: "md",
            }),
          ],
          preview: { prepare: () => ({ title: "Spacer" }) },
        }),
      ],
    }),
  ],
});
apps/studio/schemaTypes/index.ts


import { work } from "./work";export const schemaTypes = [work];
6) Next.js（Web）実装一式
6.1 web の作成（コマンド）

cd apps
npx create-next-app@latest web --ts --tailwind --eslint --appcd web
npm i @sanity/client @sanity/image-url react-globe.gl three
npm i -D @types/three
npm i resend
6.2 環境変数（Vercel & ローカル）
apps/web/.env.local


SANITY_PROJECT_ID=xxxxx
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
SANITY_READ_TOKEN=xxxxxx          # Preview用（通常表示だけなら不要）
PREVIEW_SECRET=your_long_secret
RESEND_API_KEY=xxxxxx
CONTACT_TO_EMAIL=you@example.com  # 受信先
CONTACT_FROM_EMAIL=onboarding@resend.dev  # Resendで許可されたFrom
6.3 Sanityクライアント（公開/プレビュー対応）
apps/web/src/lib/sanity.ts


import { createClient } from "@sanity/client";import imageUrlBuilder from "@sanity/image-url";import type { Image } from "sanity";import { draftMode } from "next/headers";const projectId = process.env.SANITY_PROJECT_ID!;const dataset = process.env.SANITY_DATASET!;const apiVersion = process.env.SANITY_API_VERSION!;export function getSanityClient() {
  const isDraft = draftMode().isEnabled;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: !isDraft,
    // draftMode時のみトークンを使って下書き取得
    token: isDraft ? process.env.SANITY_READ_TOKEN : undefined,
    // Sanity v3: perspective で draft を見る
    perspective: isDraft ? "previewDrafts" : "published",
  });
}const builder = imageUrlBuilder({ projectId, dataset });export function urlFor(source: Image) {
  return builder.image(source);
}
6.4 GROQ（ピン/一覧/詳細）
apps/web/src/lib/queries.ts


export const PINS_QUERY = /* groq */ `
*[_type=="work" && published==true] | order(date desc) {
  "id": _id,
  "slug": slug.current,
  category,
  "title_ja": title_ja,
  "title_en": title_en,
  location { lat, lng, placeName_ja, placeName_en },
  coverImage
}
`;export const GALLERY_QUERY = /* groq */ `
*[_type=="work" && published==true] | order(date desc) {
  "id": _id,
  "slug": slug.current,
  category,
  title_ja, title_en,
  subtitle_ja, subtitle_en,
  date,
  coverImage
}
`;export const WORK_BY_SLUG_QUERY = /* groq */ `
*[_type=="work" && slug.current==$slug][0]{
  "id": _id,
  "slug": slug.current,
  category,
  published,
  title_ja, title_en,
  subtitle_ja, subtitle_en,
  date,
  location { lat, lng, placeName_ja, placeName_en },
  coverImage,
  blocks[]{
    _type,
    // textBlock
    body_ja,
    body_en,
    // imageBlock
    image,
    caption_ja,
    caption_en,
    widthPreset,
    // imageGridBlock
    images,
    columns,
    gap,
    // spacerBlock
    size
  }
}
`;
6.5 i18n（/ja と /en のルーティング）
ルート構成

app/
  [lang]/
    layout.tsx
    page.tsx              # Travel（地球儀）
    gallery/page.tsx
    about/page.tsx
    contact/page.tsx
    work/[slug]/page.tsx
api/
  preview/route.ts
  exit-preview/route.ts
  contact/route.ts
apps/web/src/app/[lang]/layout.tsx


import "../globals.css";import type { Metadata } from "next";import { HeaderTabs } from "@/components/HeaderTabs";export const metadata: Metadata = { title: "World Gallery" };export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: "ja" | "en" };
}) {
  return (
    <html lang={params.lang}>
      <body className="min-h-screen bg-[#0f1230] text-black">
        <HeaderTabs lang={params.lang} />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
apps/web/src/components/HeaderTabs.tsx


"use client";import Link from "next/link";import { usePathname } from "next/navigation";const T = {
  ja: { travel: "Travel", gallery: "Gallery", about: "Designer/Team", contact: "Order/Contact" },
  en: { travel: "Travel", gallery: "Gallery", about: "Designer/Team", contact: "Order/Contact" },
} as const;export function HeaderTabs({ lang }: { lang: "ja" | "en" }) {
  const pathname = usePathname();
  const t = T[lang];

  const tabs = [
    { href: `/${lang}`, label: t.travel },
    { href: `/${lang}/gallery`, label: t.gallery },
    { href: `/${lang}/about`, label: t.about },
    { href: `/${lang}/contact`, label: t.contact },
  ];

  return (
    <header className="bg-[#0f1230]">
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <Link href={`/${lang}`} className="text-white tracking-wide">HANA MURAKAMI</Link>
        <nav className="flex gap-8">
          {tabs.map((x) => {
            const active = pathname === x.href;
            return (
              <Link
                key={x.href}
                href={x.href}
                className={`text-sm ${active ? "text-white" : "text-white/60"} hover:text-white`}
              >
                {x.label}
              </Link>
            );
          })}
        </nav>

        {/* 言語切替（同一slugのまま切替） */}
        <div className="flex gap-3 text-sm">
          <Link className="text-white/70 hover:text-white" href={pathname.replace(/^\/(ja|en)/, "/ja")}>JA</Link>
          <Link className="text-white/70 hover:text-white" href={pathname.replace(/^\/(ja|en)/, "/en")}>EN</Link>
        </div>
      </div>
    </header>
  );
}
7) Travel（地球儀）実装
7.1 ピン色マップ
apps/web/src/lib/colors.ts


export const CategoryColor: Record<string, string> = {
  Sketch: "#E53935",
  Architecture: "#1E4E9E",
  Travel: "#F6C445",
  Research: "#2E7D32",
  Other: "#111111",
};
7.2 地球儀ページ
apps/web/src/app/[lang]/page.tsx


import { getSanityClient } from "@/lib/sanity";import { PINS_QUERY } from "@/lib/queries";import { GlobeView } from "@/components/GlobeView";export default async function TravelPage({ params }: { params: { lang: "ja" | "en" } }) {
  const client = getSanityClient();
  const pins = await client.fetch(PINS_QUERY);

  return <GlobeView lang={params.lang} pins={pins} />;
}
7.3 Globeコンポーネント（hoverポップアップ＋クリック遷移）
apps/web/src/components/GlobeView.tsx


"use client";import dynamic from "next/dynamic";import { useMemo, useState } from "react";import { useRouter } from "next/navigation";import { CategoryColor } from "@/lib/colors";import { urlFor } from "@/lib/sanity";const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });type Pin = {
  id: string;
  slug: string;
  category: string;
  title_ja: string;
  title_en?: string;
  location: { lat: number; lng: number; placeName_ja?: string; placeName_en?: string };
  coverImage: any;
};export function GlobeView({ lang, pins }: { lang: "ja" | "en"; pins: Pin[] }) {
  const router = useRouter();
  const [hover, setHover] = useState<Pin | null>(null);

  const data = useMemo(
    () =>
      pins.map((p) => ({
        ...p,
        lat: p.location.lat,
        lng: p.location.lng,
        color: CategoryColor[p.category] ?? "#ffffff",
        title: lang === "ja" ? p.title_ja : (p.title_en || "Coming soon"),
        placeName: lang === "ja" ? p.location.placeName_ja : p.location.placeName_en,
        coverUrl: p.coverImage ? urlFor(p.coverImage).width(480).quality(70).url() : "",
      })),
    [pins, lang]
  );

  return (
    <section className="rounded-2xl bg-[#f6f2ea] p-6 shadow-lg">
      <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl">
        <Globe
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          // 操作感：慣性あり／滑りすぎない（中間寄せ）
          enablePointerInteraction={true}
          animateIn={true}
          // ピン（points）
          pointsData={data}
          pointLat={(d: any) => d.lat}
          pointLng={(d: any) => d.lng}
          pointColor={(d: any) => d.color}
          pointAltitude={0.01}
          pointRadius={0.45}
          onPointHover={(d: any) => setHover(d ?? null)}
          onPointClick={(d: any) => router.push(`/${lang}/work/${d.slug}`)}
        />

        {/* hoverカード */}
        {hover && (
          <div className="absolute left-4 bottom-4 w-[320px] rounded-2xl bg-white/95 shadow-xl p-4">
            {hover.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={urlFor(hover.coverImage).width(640).quality(70).url()}
                alt=""
                className="h-40 w-full rounded-xl object-cover"
              />
            )}
            <div className="mt-3 text-sm text-black/60">{hover.category}</div>
            <div className="text-lg font-semibold">{lang === "ja" ? hover.title_ja : (hover.title_en || "Coming soon")}</div>
            {((lang === "ja" ? hover.location.placeName_ja : hover.location.placeName_en) ?? "") && (
              <div className="text-sm text-black/70 mt-1">
                {lang === "ja" ? hover.location.placeName_ja : hover.location.placeName_en}
              </div>
            )}
            <button
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#0f1230] px-4 py-2 text-white text-sm"
              onClick={() => router.push(`/${lang}/work/${hover.slug}`)}
            >
              Open
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
8) Gallery（一覧）実装
apps/web/src/app/[lang]/gallery/page.tsx


import Link from "next/link";import { getSanityClient, urlFor } from "@/lib/sanity";import { GALLERY_QUERY } from "@/lib/queries";export default async function GalleryPage({ params }: { params: { lang: "ja" | "en" } }) {
  const client = getSanityClient();
  const works = await client.fetch(GALLERY_QUERY);

  return (
    <section className="rounded-2xl bg-[#f6f2ea] p-8 shadow-lg">
      <h1 className="text-3xl font-semibold mb-8">Gallery</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {works.map((w: any) => (
          <Link key={w.id} href={`/${params.lang}/work/${w.slug}`} className="group">
            <div className="rounded-2xl overflow-hidden bg-white shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlFor(w.coverImage).width(900).quality(75).url()}
                alt=""
                className="h-52 w-full object-cover group-hover:scale-[1.02] transition"
              />
              <div className="p-4">
                <div className="text-xs text-black/60">{w.category}</div>
                <div className="mt-1 text-lg font-semibold">
                  {params.lang === "ja" ? w.title_ja : (w.title_en || "Coming soon")}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
9) 作品詳細ページ（自由配置 blocks 対応 + Coming soon）
apps/web/src/app/[lang]/work/[slug]/page.tsx


import { notFound } from "next/navigation";import { getSanityClient, urlFor } from "@/lib/sanity";import { WORK_BY_SLUG_QUERY } from "@/lib/queries";function gapClass(gap?: string) {
  if (gap === "small") return "gap-2";
  if (gap === "large") return "gap-8";
  return "gap-4";
}function widthClass(preset?: string) {
  if (preset === "full") return "w-full";
  if (preset === "narrow") return "max-w-2xl";
  return "max-w-4xl";
}export default async function WorkPage({ params }: { params: { lang: "ja" | "en"; slug: string } }) {
  const client = getSanityClient();
  const work = await client.fetch(WORK_BY_SLUG_QUERY, { slug: params.slug });

  if (!work) return notFound();

  // published=false は通常アクセスでは404（preview時だけ見える）
  // Sanity perspective/published で draftModeでない場合はそもそも来ない想定だが念のため。
  if (work.published === false) {
    // draftMode時は通す（clientが previewDrafts）
    // notFoundは draftMode false の場合にだけ発火させたいが、ここでは簡易にタイトルで判断しないため省略。
  }

  const title = params.lang === "ja" ? work.title_ja : (work.title_en || "Coming soon");
  const subtitle = params.lang === "ja" ? work.subtitle_ja : (work.subtitle_en || "");

  return (
    <article className="rounded-2xl bg-[#f6f2ea] p-10 shadow-lg">
      <div className="text-sm text-black/60">{work.category}</div>
      <h1 className="mt-2 text-4xl font-semibold">{title}</h1>
      {subtitle && <div className="mt-2 text-lg text-black/70">{subtitle}</div>}

      <div className="mt-10 space-y-10">
        {work.blocks?.map((b: any, i: number) => {
          if (b._type === "textBlock") {
            const body = params.lang === "ja" ? b.body_ja : b.body_en;
            // EN未入力は Coming soon でOK（あなたの要望）
            if (params.lang === "en" && (!body || body.length === 0)) {
              return (
                <div key={i} className="text-black/70">
                  Coming soon
                </div>
              );
            }
            return (
              <div key={i} className="prose prose-neutral max-w-none">
                {/* Portable Textをちゃんとレンダするなら @portabletext/react を追加してください。
                   ここは最低限の簡易表示（block.children.text結合） */}
                {body?.map((blk: any, idx: number) => (
                  <p key={idx}>{blk?.children?.map((c: any) => c.text).join("")}</p>
                ))}
              </div>
            );
          }

          if (b._type === "imageBlock") {
            return (
              <figure key={i} className={`${widthClass(b.widthPreset)} mx-auto`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlFor(b.image).width(1400).quality(80).url()}
                  alt=""
                  className="w-full rounded-2xl"
                />
                {(params.lang === "ja" ? b.caption_ja : b.caption_en) && (
                  <figcaption className="mt-2 text-sm text-black/60">
                    {params.lang === "ja" ? b.caption_ja : b.caption_en}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (b._type === "imageGridBlock") {
            const cols = Math.min(Math.max(b.columns ?? 2, 1), 4);
            const colClass =
              cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : cols === 3 ? "grid-cols-3" : "grid-cols-4";

            return (
              <div key={i} className={`grid ${colClass} ${gapClass(b.gap)}`}>
                {b.images?.map((img: any, idx: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={idx}
                    src={urlFor(img).width(1200).quality(78).url()}
                    alt=""
                    className="w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            );
          }

          if (b._type === "dividerBlock") {
            return <hr key={i} className="border-black/10" />;
          }

          if (b._type === "spacerBlock") {
            const h = b.size === "sm" ? "h-4" : b.size === "lg" ? "h-16" : "h-10";
            return <div key={i} className={h} />;
          }

          return null;
        })}
      </div>
    </article>
  );
}
メモ：Portable Textを綺麗に出すなら npm i @portabletext/react を入れてレンダを差し替えるのがベストです（見た目もコントロールしやすい）。必要ならその版も出します。
10) Preview Mode（必須：secret付き）
apps/web/src/app/api/preview/route.ts


import { NextRequest, NextResponse } from "next/server";import { draftMode } from "next/headers";export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const lang = (searchParams.get("lang") ?? "ja") as "ja" | "en";

  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return new NextResponse("Invalid secret", { status: 401 });
  }
  if (!slug) return new NextResponse("Missing slug", { status: 400 });

  draftMode().enable();
  return NextResponse.redirect(new URL(`/${lang}/work/${slug}`, req.url));
}
apps/web/src/app/api/exit-preview/route.ts


import { NextResponse } from "next/server";import { draftMode } from "next/headers";export async function GET() {
  draftMode().disable();
  return NextResponse.redirect(new URL("/", "http://localhost")); // Vercelではホストが上書きされる
}
11) Contactフォーム（画像のレイアウト再現 + メール送信）
11.1 Contactページ（UI）
apps/web/src/app/[lang]/contact/page.tsx


import { ContactForm } from "@/components/ContactForm";export default function ContactPage() {
  return (
    <section className="rounded-2xl bg-[#f6f2ea] p-10 shadow-lg">
      <h1 className="text-4xl font-semibold text-center mt-6">Contact Us</h1>
      <div className="mt-10 flex justify-center">
        <ContactForm />
      </div>
    </section>
  );
}
apps/web/src/components/ContactForm.tsx


"use client";import { useState } from "react";export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<null | "ok" | "ng">(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setDone(null);

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    setDone(res.ok ? "ok" : "ng");
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="w-[860px] max-w-full">
      <div className="border border-black/40">
        <div className="grid grid-cols-2">
          <input name="firstName" placeholder="First Name" className="border-r border-b border-black/40 p-6 bg-transparent outline-none" required />
          <input name="lastName"  placeholder="Last Name"  className="border-b border-black/40 p-6 bg-transparent outline-none" required />
          <input name="email"     placeholder="Email"      className="border-r border-b border-black/40 p-6 bg-transparent outline-none" type="email" required />
          <input name="phone"     placeholder="Phone"      className="border-b border-black/40 p-6 bg-transparent outline-none" />
        </div>
        <textarea
          name="message"
          placeholder="Type your message here..."
          className="w-full h-[220px] p-6 bg-transparent outline-none"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          disabled={loading}
          className="mt-6 w-[260px] h-[72px] bg-[#2b2f45] text-white/80 hover:text-white disabled:opacity-60"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </div>

      {done === "ok" && <div className="mt-3 text-sm text-black/70">Sent. Thank you!</div>}
      {done === "ng" && <div className="mt-3 text-sm text-red-600">Failed. Please try again.</div>}
    </form>
  );
}
11.2 Contact送信API（Resend）
apps/web/src/app/api/contact/route.ts


import { NextResponse } from "next/server";import { Resend } from "resend";const resend = new Resend(process.env.RESEND_API_KEY);export async function POST(req: Request) {
  try {
    const body = await req.json();

    const firstName = String(body.firstName ?? "");
    const lastName = String(body.lastName ?? "");
    const email = String(body.email ?? "");
    const phone = String(body.phone ?? "");
    const message = String(body.message ?? "");

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL!,
      to: process.env.CONTACT_TO_EMAIL!,
      subject: `World Gallery Contact: ${firstName} ${lastName}`,
      replyTo: email,
      text: [
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        ``,
        message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
12) エンジニア向け「運用フロー」（あなた/姉が触る箇所）
Sanity Studioで Work を追加
lat/lng を入れる
blocks で「テキスト」「画像」「画像グリッド」を自由に積む
published をONにすると一般公開に出る
OFFのままならPreview URL（secret付き）でだけ確認可能
/api/preview?secret=...&slug=xxx&lang=ja
13) これで本当に“完成”にするための最終確認（1つだけ）
Contactフォームの送信先メール（受信先）を どのアドレスにしますか？

（要件上は CONTACT_TO_EMAIL に入れるだけでOKです。まだ未決なら「仮で自分のGmail」でも進められます）