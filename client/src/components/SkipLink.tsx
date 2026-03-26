/**
 * SkipLink - Skip to main content link for accessibility
 * Only visible when focused (keyboard navigation)
 */

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#a855f7] focus:text-black focus:font-bold focus:text-sm focus:rounded focus:outline-none"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      メインコンテンツへスキップ
    </a>
  );
}
