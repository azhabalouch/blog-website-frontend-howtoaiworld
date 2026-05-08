interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudflareImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  // In development, return the source with width as a query param
  // so Next.js can verify the loader implements width
  if (process.env.NODE_ENV === "development") {
    const separator = src.includes("?") ? "&" : "?";
    // Encode spaces for proper srcset parsing in dev mode
    const encodedSrc = src.replace(/ /g, "%20");
    return `${encodedSrc}${separator}w=${width}`;
  }

  const q = quality || 75;
  const params = [`width=${width}`, `quality=${q}`, "format=auto"];

  // Encode spaces and special characters in the src path
  // encodeURI preserves path structure (/) while encoding spaces, parens, etc.
  const encodedSrc = encodeURI(src);

  // For external URLs
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return `/cdn-cgi/image/${params.join(",")}/${encodedSrc}`;
  }

  // For local paths (e.g., /images/blog-image.jpg)
  return `/cdn-cgi/image/${params.join(",")}${encodedSrc}`;
}
