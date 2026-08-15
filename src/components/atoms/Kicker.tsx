type KickerProps = { children: React.ReactNode };

export function Kicker({ children }: KickerProps) {
  return <p className="kicker">{children}</p>;
}
