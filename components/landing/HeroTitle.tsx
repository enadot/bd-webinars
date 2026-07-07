"use client";

import { useEffect, useState } from "react";

/**
 * Character-by-character hero reveal (GSAP-style stagger, zero deps).
 * Characters are grouped into whitespace-nowrap word spans so lines break
 * only between words. SSR renders the full title for SEO/no-JS.
 */
export default function HeroTitle({ text }: { text: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const words = text.split(" ");
  let charIndex = 0;

  return (
    <h1
      className="font-display text-[2.6rem] leading-none tracking-tight text-ink sm:text-7xl lg:text-[7rem]"
      aria-label={text}
    >
      {words.map((word, w) => (
        <span key={w} aria-hidden="true">
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, c) => {
              const delay = charIndex++ * 55;
              return (
                <span
                  key={c}
                  className={mounted ? "char-reveal" : "inline-block"}
                  style={mounted ? { animationDelay: `${delay}ms` } : undefined}
                >
                  {char}
                </span>
              );
            })}
          </span>
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}
