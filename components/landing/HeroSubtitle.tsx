const HIGHLIGHT = "דירה להשקעה";
const PUNCH = "והבנק מסרב?";

/**
 * Subtitle with a swept lime highlighter behind "דירה להשקעה" and a
 * self-drawing squiggle under the "והבנק מסרב?" punch. Falls back to plain
 * text automatically when the admin edits the copy away from these phrases.
 */
export default function HeroSubtitle({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  let rest = text;

  const pushPlain = (s: string, key: string) =>
    s && nodes.push(<span key={key}>{s}</span>);

  const hi = rest.indexOf(HIGHLIGHT);
  if (hi >= 0) {
    pushPlain(rest.slice(0, hi), "pre-hi");
    nodes.push(
      <mark key="hi" className="subtitle-highlight">
        {HIGHLIGHT}
      </mark>
    );
    rest = rest.slice(hi + HIGHLIGHT.length);
  }

  const pi = rest.indexOf(PUNCH);
  if (pi >= 0) {
    pushPlain(rest.slice(0, pi), "pre-punch");
    nodes.push(
      <span key="punch" className="subtitle-punch font-display">
        {PUNCH}
        <svg
          className="squiggle"
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M2 6 Q 12 1, 24 5 T 48 5 T 72 5 T 98 4"
            pathLength="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
    rest = rest.slice(pi + PUNCH.length);
  }

  pushPlain(rest, "tail");

  return (
    <p className="mx-auto mt-7 max-w-2xl font-heading text-2xl leading-normal text-ink sm:text-3xl">
      {nodes}
    </p>
  );
}
