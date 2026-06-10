import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Billing() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUser(user)
    }
    load()
  }, [])

  async function handleSubscribe() {
    setLoading(true)
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email })
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div className="page" style={{ background: '#0F172A', minHeight: '100vh' }}>
      <div className="topbar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1>Billing</h1><p>Manage your subscription</p></div>
          <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>← Dashboard</Link>
        </div>
      </div>
      <div className="content" style={{ maxWidth: 440, margin: '0 auto', paddingTop: 40 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 32, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, background: '#FAECE7', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 26 }}>⚡</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 8 }}>FieldClose Pro</h2>
          <div style={{ fontSize: 40, fontWeight: 800, color: '#D85A30', margin: '16px 0 4px' }}>$99<span style={{ fontSize: 18, color: '#888', fontWeight: 400 }}>/month</span></div>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>Everything you need to close more jobs</p>
          <div style={{ textAlign: 'left', marginBottom: 28 }}>
            {['Unlimited proposals', 'Good/better/best pricing', 'Customer signature capture', 'Owner dashboard', 'Admin panel — edit pricing anytime', 'Cancel anytime'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14, color: '#333' }}>
                <span style={{ color: '#D85A30', fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
          </div>
          <button className="btn-primary" disabled={loading} onClick={handleSubscribe}>
            {loading ? 'Loading...' : 'Start subscription — $99/mo'}
          </button>
          <p style={{ fontSize: 12, color: '#aaa', marginTop: 12 }}>Secure payment via Stripe · Cancel anytime</p>
        </div>
      </div>
    </div>
  )
}
