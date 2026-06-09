import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  async function handleSignup() {
    setLoading(true); setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      const uid = data.user.id
      await supabase.from('profiles').upsert({ id: uid, company_name: companyName, owner_name: ownerName, email })
      await supabase.from('systems').upsert([
        { profile_id: uid, tier: 'good', name: 'Good — 14 SEER2', description: 'Standard efficiency unit, 1-year parts & labor warranty', price: 5800, warranty: '1 year', features: ['Like-for-like replacement', '1-year warranty', 'Same-day install available'], popular: false },
        { profile_id: uid, tier: 'better', name: 'Better — 16 SEER2', description: 'High efficiency unit, 5-year parts & labor warranty', price: 7400, warranty: '5 years', features: ['Lower monthly energy bills', '5-year warranty', 'Free first-year tune-up'], popular: true },
        { profile_id: uid, tier: 'best', name: 'Best — 18 SEER2', description: 'Premium efficiency unit, 10-year warranty + maintenance plan', price: 9200, warranty: '10 years', features: ['Maximum efficiency', '10-year warranty', 'Annual maintenance included', 'Priority service calls'], popular: false },
      ])
      await supabase.from('addons').upsert([
        { profile_id: uid, name: 'UV Air Purifier', description: 'Indoor air quality upgrade', price: 650 },
        { profile_id: uid, name: 'Smart Thermostat', description: 'Ecobee or Nest', price: 280 },
        { profile_id: uid, name: 'Maintenance Plan', description: 'Annual, 2 visits/yr', price: 199 },
      ])
    }
    router.push('/dashboard')
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 56, height: 56, background: 'var(--orange)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 26 }}>⚡</div>
        <h1 style={{ fontSize: 26, fontWeight: 600, color: '#111' }}>FieldClose</h1>
        <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>HVAC Sales Tool</p>
      </div>
      <div style={{ display: 'flex', background: '#f5f5f0', borderRadius: 10, padding: 4, marginBottom: 24 }}>
        <button onClick={() => setMode('login')} style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: mode === 'login' ? 'white' : 'transparent', fontWeight: mode === 'login' ? 600 : 400, cursor: 'pointer', fontSize: 14 }}>Log in</button>
        <button onClick={() => setMode('signup')} style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: mode === 'signup' ? 'white' : 'transparent', fontWeight: mode === 'signup' ? 600 : 400, cursor: 'pointer', fontSize: 14 }}>Sign up</button>
      </div>
      {mode === 'signup' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Company name</label>
            <input className="input" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="ABC HVAC Services" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Your name</label>
            <input className="input" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="John Smith" />
          </div>
        </>
      )}
      <div style={{ marginBottom: 12 }}>
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      {error && <p style={{ color: 'red', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <button className="btn-primary" disabled={loading} onClick={mode === 'login' ? handleLogin : handleSignup}>
        {loading ? 'Loading...' : mode === 'login' ? 'Log in' : 'Create account'}
      </button>
    </div>
  )
}
