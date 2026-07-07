"use client";

import { useEffect, useState } from "react";

/**
 * Character-by-character hero reveal (GSAP-style stagger, zero deps).
 * SSR renders the full title for SEO/no-JS; the animation classes only
 * attach after mount so the text never disappears.
 */
export default function HeroTitle({ text }: { text: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const chars = Array.from(text);

  return (
    <h1
      className="font-display text-6xl leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-[7rem]"
      aria-label={text}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={mounted && char !== " " ? "char-reveal" : undefined}
          style={
            mounted && char !== " "
              ? { animationDelay: `${i * 55}ms` }
              : undefined
          }
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </h1>
  );
}
