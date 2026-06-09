import { useRouter } from 'next/router'

export default function Landing() {
  const router = useRouter()
  return (
    <div style={{ fontFamily: 'sans-serif', background: '#0F172A', color: 'white', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>⚡ FieldClose</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="mailto:braeden@fieldclose.net" style={{ padding: '9px 18px', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, fontSize: 14, color: 'white', textDecoration: 'none' }}>Request demo</a>
          <button onClick={() => router.push('/login')} style={{ padding: '9px 18px', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#F97316', color: 'white' }}>Get started</button>
        </div>
      </div>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(249,115,22,0.15)', color: '#F97316', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 20, marginBottom: 24, border: '1px solid rgba(249,115,22,0.3)' }}>Built for HVAC companies in Dallas-Fort Worth</div>
        <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 20 }}>Turn every service call into a <span style={{ color: '#F97316' }}>closed deal</span></h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 36 }}>Give your techs a professional sales tool they can use on-site. Present good/better/best options, capture signatures, and close more jobs right at the kitchen table.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/login')} style={{ padding: '15px 32px', background: '#F97316', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Start free trial</button>
          <a href="mailto:braeden@fieldclose.net" style={{ padding: '15px 32px', background: 'transparent', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>Request a demo</a>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 16 }}>No credit card required. Setup in 10 minutes. Cancel anytime.</p>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[['2x', 'average close rate improvement'], ['$1,800', 'average increase in job value'], ['10 min', 'to set up and start closing']].map(([num, label], i) => (
            <div key={i} style={{ padding: '32px 20px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#F97316' }}>{num}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 48 }}>Everything your tech needs to close on-site</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {[['⚡', 'Good / better / best pricing', 'Present three options professionally every time. Customers who see options spend more.'],['✍️', 'Sign on the spot', 'Capture customer signature right on the tablet. No paperwork, no follow-up calls.'],['🔧', 'Repair vs. replace guidance', 'Smart recommendations based on system age and diagnosis. Techs always say the right thing.'],['📊', 'Owner dashboard', 'See every proposal, every closed job, and your total revenue in real time.']].map(([icon, title, desc], i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#F97316' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '72px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 12 }}>Ready to close more jobs?</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginBottom: 36 }}>Set up in 10 minutes. No training needed. Works on any phone or tablet.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/login')} style={{ padding: '15px 32px', background: '#0F172A', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Start free trial</button>
            <a href="mailto:braeden@fieldclose.net" style={{ padding: '15px 32px', background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>Request a demo</a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 16, fontWeight: 800 }}>⚡ FieldClose</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>2026 FieldClose. All rights reserved.</div>
      </div>
    </div>
  )
}
