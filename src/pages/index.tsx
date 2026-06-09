import { useRouter } from 'next/router'

export default function Landing() {
  const router = useRouter()

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', background: '#0F172A', color: 'white', minHeight: '100vh' }}>

      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 40px', borderBottom: '1px solid rgba(255,255,255,0.08)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: '#F97316', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px' }}>FieldClose</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="mailto:braeden@fieldclose.net"><button style={{ padding: '9px 18px', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', background: 'transparent', color: 'white' }}>Request demo</button></a>
          <button onClick={() => router.push('/login')} style={{ padding: '9px 18px', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#F97316', color: 'white' }}>Get started</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 40px 70px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(249,115,22,0.15)', color: '#F97316', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 20, marginBottom: 24, border: '1px solid rgba(249,115,22,0.3)' }}>Built for HVAC companies in Dallas–Fort Worth</div>
        <h1 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 20 }}>Turn every service call<br />into a <span style={{ color: '#F97316' }}>closed deal</span></h1>
        <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 540, margin: '0 auto 36px' }}>Give your techs a professional sales tool they can use on-site. Present good/better/best options, capture signatures, and close more jobs — right at the kitchen table.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/login')} style={{ padding: '15px 32px', background: '#F97316', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Start free trial →</button>
          <a href="mailto:braeden@fieldclose.net"><button style={{ padding: '15px 32px', background: 'transparent', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Request a demo</button></a>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 16 }}>No credit card required · Setup in 10 minutes · Cancel anytime</p>
      </div>

      {/* Stats */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[['2x', 'average close rate improvement'], ['$1,800', 'average increase in job value'], ['10 min', 'to set up and start closing']].map(([num, label]) => (
            <div key={num} style={{ padding: '32px 20px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#F97316' }}>{num}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6, lineHeight: 1.4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 10, letterSpacing: '-0.5px' }}>Everything your tech needs to close on-site</h2>
        <p style={{ textAlign: 'center', fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 48 }}>Simple enough to use on every call. Powerful enough to change your revenue.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {[
            ['⚡', 'Good / better / best pricing', 'Present three options professionally every time. Customers who see options spend more. Every time.'],
            ['✍️', 'Sign on the spot', 'Capture customer signature right on the tablet. No paperwork, no follow-up calls, no lost jobs.'],
            ['🔧', 'Repair vs. replace guidance', 'Smart recommendations based on system age and diagnosis. Your techs always say the right thing.'],
            ['📊', 'Owner dashboard', 'See every proposal, every closed job, and your total revenue in real time from anywhere.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 28 }}>
              <div style={{ width: 44, height: 44, background: 'rgba(249,115,22,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 20 }}>{icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 40px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 10, letterSpacing: '-0.5px' }}>How it works</h2>
          <p style={{ textAlign: 'center', fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 48 }}>Three steps. Every call. No training needed.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 560, margin: '0 auto' }}>
            {[
              ['1', 'Tech arrives on-site', 'Opens FieldClose on their phone or tablet. Enters customer info and diagnosis in under 60 seconds.'],
              ['2', 'Present the options', 'Hands the device to the customer. Three clear options — good, better, best — with prices, features, and financing.'],
              ['3', 'Close the job', 'Customer picks an option and signs on the screen. Proposal saved instantly. Owner notified. Job closed.'],
            ].map(([num, title, desc]) => (
              <div key={num} style={{ display: 'flex', alignItems: 'flex-start', gap: 18Sonnet 4.6 Low
