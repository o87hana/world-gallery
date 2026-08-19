import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/lib/sanity.client";
import { SanityImage } from "@/components/SanityImage";
import type { Lang } from "@/lib/i18n";
import {
  localizedOptionalValue,
  type WorkContentBlock,
  type WorkImage,
  type WorkImageBlock,
  type WorkImageGridBlock,
  type WorkTextBlock,
} from "@/lib/work";

const gridColsClass = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
} as const;

const gridGapClass = {
  small: "gap-3",
  medium: "gap-5",
  large: "gap-8",
} as const;

const widthClass = {
  full: "w-full",
  medium: "max-w-3xl",
  narrow: "max-w-xl",
} as const;

const spacerClass = {
  s: "h-6",
  m: "h-10",
  l: "h-16",
} as const;

const richTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-6 text-base leading-7 text-black/80">{children}</p>,
    h2: ({ children }) => <h2 className="mt-10 text-2xl font-semibold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-xl font-semibold">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-[#1e4e9e] pl-5 text-lg italic text-black/70">
        {children}
      </blockquote>
    ),
  },
};

function imageUrl(image: WorkImage, width: number) {
  return urlFor(image as SanityImageSource).width(width).auto("format").url();
}

function ImageBlock({ block, lang }: { block: WorkImageBlock; lang: Lang }) {
  if (!block.image?.asset) return null;

  const width = widthClass[block.widthPreset ?? "full"] ?? widthClass.full;
  const caption = localizedOptionalValue(lang, block.caption_ja, block.caption_en);

  return (
    <figure className={`mx-auto mt-8 ${width}`}>
      <SanityImage
        src={imageUrl(block.image, 1600)}
        alt={block.image.alt ?? ""}
        sizes={block.widthPreset === "narrow" ? "576px" : block.widthPreset === "medium" ? "768px" : "(max-width: 1279px) calc(100vw - 5rem), 1088px"}
        className="h-auto w-full rounded-xl"
      />
      {caption ? <figcaption className="mt-3 text-sm text-black/60">{caption}</figcaption> : null}
    </figure>
  );
}

function GridImage({ image, lang }: { image: WorkImage; lang: Lang }) {
  if (!image.asset) return null;
  const caption = localizedOptionalValue(lang, image.caption_ja, image.caption_en);

  return (
    <figure className="overflow-hidden rounded-xl">
      <SanityImage
        src={imageUrl(image, 1200)}
        alt={image.alt ?? ""}
        sizes="(max-width: 639px) calc(100vw - 3rem), (max-width: 1023px) 50vw, 25vw"
        className="h-auto w-full"
      />
      {caption ? <figcaption className="mt-2 text-sm text-black/60">{caption}</figcaption> : null}
    </figure>
  );
}

function ImageGridBlock({ block, lang }: { block: WorkImageGridBlock; lang: Lang }) {
  const images = block.images?.filter((image) => image.asset) ?? [];
  if (images.length === 0) return null;

  const columns = block.columns ?? 2;
  const gap = block.gap ?? "medium";

  return (
    <div className={`mt-10 grid ${gridColsClass[columns]} ${gridGapClass[gap]}`}>
      {images.map((image, index) => (
        <GridImage key={image._key ?? index} image={image} lang={lang} />
      ))}
    </div>
  );
}

function TextBlock({ block, lang }: { block: WorkTextBlock; lang: Lang }) {
  const value = lang === "ja" ? block.body_ja : block.body_en?.length ? block.body_en : block.body_ja;

  if (!value?.length) {
    return null;
  }

  return <PortableText value={value} components={richTextComponents} />;
}

function isPortableTextBlock(block: WorkContentBlock): block is PortableTextBlock {
  return block._type === "block";
}

export function WorkContent({ blocks, lang }: { blocks: WorkContentBlock[]; lang: Lang }) {
  return (
    <div className="mt-6">
      {blocks.map((block, index) => {
        const key = block._key ?? `${block._type}-${index}`;

        if (isPortableTextBlock(block)) {
          return <PortableText key={key} value={[block]} components={richTextComponents} />;
        }

        switch (block._type) {
          case "textBlock":
            return <TextBlock key={key} block={block} lang={lang} />;
          case "imageBlock":
            return <ImageBlock key={key} block={block} lang={lang} />;
          case "imageGridBlock":
            return <ImageGridBlock key={key} block={block} lang={lang} />;
          case "spacer":
            return <div key={key} className={spacerClass[block.size ?? "m"]} aria-hidden="true" />;
          case "divider":
            return (
              <hr
                key={key}
                className={`my-10 border-t border-black/10 ${block.style === "dashed" ? "border-dashed" : "border-solid"}`}
              />
            );
        }
      })}
    </div>
  );
}
