/** Static files include a precompressed copy for GitHub Pages and other hosts
 * that don't compress JSON. Older browsers can use the plain JSON fallback. */
export async function loadAnalysis<T>(
  file: string,
  signal: AbortSignal
): Promise<T> {
  const base = `${process.env.PUBLIC_URL || ""}/${file}`;
  const Decompress = (window as any).DecompressionStream;
  if (Decompress) {
    const compressed = await fetch(base + ".gz", { signal });
    if (compressed.ok && compressed.body) {
      const stream = compressed.body.pipeThrough(new Decompress("gzip"));
      return new Response(stream).json();
    }
  }
  const response = await fetch(base, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
