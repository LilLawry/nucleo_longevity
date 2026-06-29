import Image from "next/image";

/**
 * Wordmark — the official Nucleo Longevity lockup (NUCLEO with the nucleus as
 * the "O", LONGEVITY tracked beneath). Uses the brand PNG assets verbatim and
 * swaps ink/white by theme via CSS so there is no hydration flash.
 *
 * Control the rendered size with a height utility in `className`
 * (e.g. "h-9 w-auto"); the assets keep their 1884×1005 aspect ratio.
 */
export default function Wordmark({ className = "h-9 w-auto", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <>
      <Image
        src="/wordmark-ink-trim.png"
        alt="Nucleo Longevity"
        width={1398}
        height={412}
        priority={priority}
        className={`${className} block dark:hidden`}
      />
      <Image
        src="/wordmark-white-trim.png"
        alt="Nucleo Longevity"
        width={1398}
        height={412}
        priority={priority}
        aria-hidden
        className={`${className} hidden dark:block`}
      />
    </>
  );
}
