export default function ModeCard({
  active,
  onClick,
  title,
  body,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  body: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl p-5 border transition-colors ${
        active
          ? "border-brand-primary bg-brand-pale"
          : "border-brand-border bg-white hover:border-brand-muted"
      }`}
    >
      <p className="font-jost font-semibold text-brand-heading mb-1">{title}</p>
      <p className="text-sm text-brand-text">{body}</p>
    </button>
  );
}