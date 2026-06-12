// Static-export image loader: next/image doesn't apply basePath to
// unoptimized srcs, so on GitHub Pages (/REDLINE/) we prefix it ourselves.
export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}?w=${width}`;
}
