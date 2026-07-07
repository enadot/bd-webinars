export default function SectionHeading({
  title,
  intro,
  light = false,
  id,
}: {
  title: string;
  intro?: string;
  light?: boolean;
  id?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <h2
        id={id}
        className={`text-3xl font-extrabold sm:text-4xl ${light ? "text-white" : "text-brand-primary"}`}
      >
        {title}
      </h2>
      <div className="gold-line mx-auto mt-4 h-0.5 w-24" aria-hidden="true" />
      {intro ? (
        <p className={`mt-4 text-lg ${light ? "text-white/80" : "text-brand-ink/75"}`}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}
