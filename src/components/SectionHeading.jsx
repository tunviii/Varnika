// Eyebrow + h2 block used at the top of homepage sections.
export default function SectionHeading({ eyebrow, title, id }) {
  return (
    <div className="flex flex-col md:gap-2">
      <div className="type-eyebrow text-taupe-deep mb-2 md:mb-0">{eyebrow}</div>
      <h2 id={id} className="m-0 type-h2">{title}</h2>
    </div>
  );
}
