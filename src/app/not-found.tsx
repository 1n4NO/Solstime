import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found">
      <span className="not-found-mark" aria-hidden="true"><span /></span>
      <p className="not-found-code">404 / OUT OF ORBIT</p>
      <h1>This moment isn’t on the dial.</h1>
      <Link href="/">Return to Solstime</Link>
    </main>
  );
}
