export function NoonMidnightMark({ type }: { type: 'sun' | 'moon' }) {
  return <svg className={`noon-midnight-mark noon-midnight-mark--${type}`} viewBox="0 0 24 24" aria-hidden="true">
    {type === 'sun' ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" /></> : <path d="M17.5 16.8A8 8 0 0 1 7.2 6.5 8.5 8.5 0 1 0 17.5 16.8Z" />}
  </svg>;
}
