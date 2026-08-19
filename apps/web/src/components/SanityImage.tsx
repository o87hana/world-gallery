import Image from "next/image";

const SANITY_DIMENSIONS_PATTERN = /-(\d+)x(\d+)\.[a-z0-9]+$/iu;

export function getSanityImageDimensions(src: string) {
  try {
    const url = new URL(src);
    if (url.protocol !== "https:" || url.hostname !== "cdn.sanity.io") return { width: 3, height: 2 };
    const match = url.pathname.match(SANITY_DIMENSIONS_PATTERN);
    if (!match) return { width: 3, height: 2 };
    return { width: Number(match[1]), height: Number(match[2]) };
  } catch {
    return { width: 3, height: 2 };
  }
}

export function SanityImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  loading,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
}) {
  const { width, height } = getSanityImageDimensions(src);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      loading={loading}
      className={className}
    />
  );
}
