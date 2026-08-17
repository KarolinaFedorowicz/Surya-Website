/**
 * Max-width and gutters. No visual styling of its own.
 */
export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
