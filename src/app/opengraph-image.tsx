import { ImageResponse } from 'next/og';

export const alt = 'Solstime 24 hour planner dial';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ background: '#111513', color: '#f3f0e8', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '54px 68px', fontFamily: 'Arial' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 25, fontWeight: 700, letterSpacing: -1 }}>
          <svg width="24" height="24" viewBox="0 0 28 28"><circle cx="14" cy="14" r="10.5" fill="none" stroke="#f1b56e" strokeWidth="2.2" strokeDasharray="49 17" transform="rotate(-42 14 14)" /><path d="M14 3.5V24.5" fill="none" stroke="#f1b56e" strokeWidth="2.2" /></svg>
          solstime
        </div>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: 90 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div style={{ color: '#f1b56e', fontSize: 16, letterSpacing: 4 }}>24 HOUR PLANNER</div>
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: 62, letterSpacing: -4, lineHeight: 1 }}>Make room for<br />what matters.</div>
            <div style={{ color: '#9da49b', fontSize: 20 }}>A clear view of your day, tuned to the light outside.</div>
          </div>
          <div style={{ width: 330, height: 330, borderRadius: '50%', border: '2px solid #4a554a', background: '#1b211d', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 18px #191f1b, 0 0 0 20px #303932' }}>
            <div style={{ width: 170, height: 170, borderRadius: '50%', background: '#161b18', border: '1px solid #4a554a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ color: '#f1b56e', fontSize: 12, letterSpacing: 3 }}>LOCAL TIME</div>
              <div style={{ fontSize: 43, marginTop: 10 }}>12:00</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
