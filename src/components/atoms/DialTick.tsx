type DialTickProps = { index: number };

export function DialTick({ index }: DialTickProps) {
  const isMajor = index % 4 === 0;
  return <span className={`dial-tick${isMajor ? ' dial-tick--major' : ''}`} style={{ transform: `rotate(${index * 7.5}deg)` }} />;
}
