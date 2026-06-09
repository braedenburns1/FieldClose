import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'
import SignatureCanvas from 'react-signature-canvas'

const DIAGNOSES = ['Failed compressor', 'Refrigerant leak', 'Bad capacitor / contactor', 'Heat exchanger cracked', 'General wear / tune-up', 'Customer wants upgrade', 'Other']
const AGES = ['0–5 years', '6–10 years', '11–15 years', '16+ years']

function getRecommendation(age: string, diagnosis: string) {
  const oldSystem = age === '11–15 years' || age === '16+ years'
  const majorIssue = ['Failed compressor', 'Heat exchanger cracked'].includes(diagnosis)
  if (oldSystem && majorIssue) return 'replace'
  if (age === '16+ years') return 'replace'
  return 'repair'
}

function getRecReason(age: string, diagnosis: string, rec: string) {
  if (rec === 'replace') {
    if (age === '16+ years') return `System is ${age} old. At this age, replacement typically delivers better long-term value than repair.`
    return `System is ${age} old with a ${diagnosis.toLowerCase()}. Repair cost likely exceeds 50% of replacement — recommend replacement.`
  }
  return `System is ${age} old with a ${diagnosis.toLowerCase()}. Repair is the most cost-effective option here.`
}

export default function NewCall() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [user, setUser] = useState<any>(null)
  const [systems, setSystems] = useState<any[]>([])
  const [addons, setAddons] = useState<any[]>([])
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const sigRef = useRef<SignatureCanvas>(null)

  const [form, setForm] = useState({
    customer_name: '', customer_email: '', address: '',
    system_age: '', diagnosis: '', notes: '',
    recommendation: 'replace', selected_tier: 'better',
    selected_system_id: '',
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUser(user)
      const { data: sys } = await supabase.from('systems').select('*').eq('profile_id', user.id).order('price')
      const { data: add } = await supabase.from('addons').select('*').eq('profile_id', user.id)
      setSystems(sys || [])
      setAddons(add || [])
      if (sys && sys.length > 0) {
        const better = sys.find((s: any) => s.tier === 'better') || sys[1] || sys[0]
        setForm(f => ({ ...f, selected_system_id: better?.id || '', selected_tier: better?.tier || 'better' }))
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (form.system_age && form.diagnosis) {
      const rec = getRecommendation(form.system_age, form.diagnosis)
      setForm(f => ({ ...f, recommendation: rec }))
    }
  }, [form.system_age, form.diagnosis])

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })) }

  function selectSystem(sys: any) {
    setForm(f => ({ ...f, selected_system_id: sys.id, selected_tier: sys.tier }))
  }

  function toggleAddon(id: string) {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  function getTotal() {
    const sys = systems.find(s => s.id === form.selected_system_id)
    const sysPrice = sys?.price || 0
    const addonTotal = selectedAddons.reduce((sum, id) => {
      const a = addons.find(a => a.id === id)
      return sum + (a?.price || 0)
    }, 0)
    return sysPrice + addonTotal
  }

  async function saveProposal(status: string, sigData?: string) {
    setSaving(true)
    const { data } = await supabase.from('proposals').insert({
      profile_id: user.id,
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      address: form.address,
      system_age: form.system_age,
      diagnosis: form.diagnosis,
      recommendation: form.recommendation,
      selected_tier: form.selected_tier,
      selected_system_id: form.selected_system_id,
      selected_addons: selectedAddons,
      total_price: getTotal(),
      status,
      signature_data: sigData || '',
      notes: form.notes,
    }).select().single()
    setSaving(false)
    if (data) router.push(`/proposal/${data.id}`)
  }

  async function handleClose() {
    const sig = sigRef.current?.isEmpty() ? '' : sigRef.current?.toDataURL() || ''
    await saveProposal(sig ? 'signed' : 'sent', sig)
  }

  const selectedSys = systems.find(s => s.id === form.selected_system_id)
  const recReason = form.system_age && form.diagnosis ? getRecReason(form.system_age, form.diagnosis, form.recommendation) : ''

  return (
    <div className="page">
      <div className="topbar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1>New call</h1><p>Step {step} of 4</p></div>
          <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Cancel</Link>
        </div>
      </div>

      {step === 1 && (
        <>
          <div className="content">
            <div className="step-bar">{[1,2,3,4].map(n => <div key={n} className={`step-dot ${n < step ? 'done' : n === step ? 'active' : ''}`} />)}</div>
            <div className="section-title">customer info</div>
            <div style={{ marginBottom: 12 }}><label className="label">Customer name *</label><input className="input" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} placeholder="First and last name" /></div>
            <div style={{ marginBottom: 12 }}><label className="label">Email (for proposal)</label><input className="input" type="email" value={form.customer_email} onChange={e => set('customer_email', e.target.value)} placeholder="customer@email.com" /></div>
            <div style={{ marginBottom: 12 }}><label className="label">Address *</label><input className="input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, Dallas TX" /></div>
            <div style={{ marginBottom: 12 }}><label className="label">System age *</label><select className="input" value={form.system_age} onChange={e => set('system_age', e.target.value)}><option value="">Select age</option>{AGES.map(a => <option key={a}>{a}</option>)}</select></div>
            <div style={{ marginBottom: 12 }}><label className="label">What did you find? *</label><select className="input" value={form.diagnosis} onChange={e => set('diagnosis', e.target.value)}><option value="">Select diagnosis</option>{DIAGNOSES.map(d => <option key={d}>{d}</option>)}</select></div>
            <div style={{ marginBottom: 12 }}><label className="label">Tech notes</label><textarea className="input" style={{ height: 72, resize: 'none' }} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="What you found, keep it simple..." /></div>
          </div>
          <div className="footer-bar">
            <button className="btn-primary" disabled={!form.customer_name || !form.system_age || !form.diagnosis} onClick={() => setStep(2)}>Next — repair vs. replace →</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="content">
            <div className="step-bar">{[1,2,3,4].map(n => <div key={n} className={`step-dot ${n < step ? 'done' : n === step ? 'active' : ''}`} />)}</div>
            {recReason && <div style={{ background: 'var(--orange-light)', border: '1px solid var(--orange-mid)', borderRadius: 10, padding: 14, marginBottom: 18, fontSize: 13, color: 'var(--orange-dark)', lineHeight: 1.5 }}><strong>Recommendation:</strong> {recReason}</div>}
            <div className="section-title">your recommendation</div>
            <div className="option-grid">
              <div className={`option-card ${form.recommendation === 'repair' ? 'selected' : ''}`} onClick={() => set('recommendation', 'repair')}><div style={{ fontSize: 22, marginBottom: 6 }}>🔧</div><div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Repair</div><div style={{ fontSize: 11, color: '#888' }}>Fix the issue</div></div>
              <div className={`option-card ${form.recommendation === 'replace' ? 'selected' : ''}`} onClick={() => set('recommendation', 'replace')}><div style={{ fontSize: 22, marginBottom: 6 }}>♻️</div><div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Replace</div><div style={{ fontSize: 11, color: '#888' }}>New system</div></div>
            </div>
          </div>
          <div className="footer-bar">
            <button className="btn-primary" onClick={() => setStep(3)}>Next — build proposal →</button>
            <button className="btn-secondary" onClick={() => setStep(1)}>← back</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="content">
            <div className="step-bar">{[1,2,3,4].map(n => <div key={n} className={`step-dot ${n < step ? 'done' : n === step ? 'active' : ''}`} />)}</div>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Hand the device to the customer and let them choose.</p>
            {systems.map(sys => (
              <div key={sys.id} className={`tier-card ${form.selected_system_id === sys.id ? 'selected' : ''}`} onClick={() => selectSystem(sys)}>
                {sys.popular && <div className="tier-badge">Most popular</div>}
                <div style={{ fontSize: 16, fontWeight: 600 }}>{sys.tier.charAt(0).toUpperCase() + sys.tier.slice(1)}</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--orange)', margin: '4px 0' }}>${sys.price.toLocaleString()}</div>
                <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{sys.description}</div>
                <div style={{ marginTop: 10 }}>{(sys.features || []).map((f: string) => <div key={f} style={{ fontSize: 12, color: '#666', padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: 'var(--orange)' }}>✓</span> {f}</div>)}</div>
              </div>
            ))}
            {addons.length > 0 && <>
              <div className="section-title" style={{ marginTop: 8 }}>add-ons</div>
              {addons.map(a => (
                <div key={a.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: selectedAddons.includes(a.id) ? '2px solid var(--orange)' : '1px solid #eee' }} onClick={() => toggleAddon(a.id)}>
                  <div><div style={{ fontSize: 14, fontWeight: 600 }}>{a.name}</div><div style={{ fontSize: 12, color: '#888' }}>{a.description}</div></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 600, color: 'var(--orange)' }}>${a.price.toLocaleString()}</span>
                    <div style={{ width: 20, height: 20, borderRadius: 4, border: '2px solid var(--orange)', background: selectedAddons.includes(a.id) ? 'var(--orange)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>{selectedAddons.includes(a.id) ? '✓' : ''}</div>
                  </div>
                </div>
              ))}
            </>}
            <div style={{ background: '#f5f5f0', borderRadius: 10, padding: 14, marginTop: 8 }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>financing available</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>As low as $89/mo · 0% for 18 months · approve in 60 sec</div>
            </div>
          </div>
          <div className="footer-bar">
            <button className="btn-primary" onClick={() => setStep(4)}>Customer selected — close it →</button>
            <button className="btn-secondary" onClick={() => setStep(2)}>← back</button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="content">
            <div className="step-bar">{[1,2,3,4].map(n => <div key={n} className={`step-dot ${n < step ? 'done' : n === step ? 'active' : ''}`} />)}</div>
            <div className="section-title">order summary</div>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}><span style={{ fontSize: 13, color: '#888' }}>Customer</span><span style={{ fontSize: 13, fontWeight: 600 }}>{form.customer_name}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}><span style={{ fontSize: 13, color: '#888' }}>System</span><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--orange)' }}>{selectedSys?.name}</span></div>
              {selectedAddons.map(id => { const a = addons.find(a => a.id === id); return a ? <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}><span style={{ fontSize: 13, color: '#888' }}>{a.name}</span><span style={{ fontSize: 13, fontWeight: 600 }}>${a.price.toLocaleString()}</span></div> : null })}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0' }}><span style={{ fontSize: 14, fontWeight: 600 }}>Total</span><span style={{ fontSize: 16, fontWeight: 700, color: 'var(--orange)' }}>${getTotal().toLocaleString()}</span></div>
            </div>
            <div className="section-title">customer signature</div>
            <div style={{ border: '1px solid #ddd', borderRadius: 10, overflow: 'hidden', marginBottom: 8, background: 'white' }}>
              <SignatureCanvas ref={sigRef} canvasProps={{ width: 380, height: 120, style: { width: '100%', height: 120 } }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button onClick={() => sigRef.current?.clear()} style={{ fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>Clear signature</button>
            </div>
            {form.customer_email && <div style={{ background: '#f5f5f0', borderRadius: 10, padding: 14, marginBottom: 16 }}><div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Proposal will also be emailed to</div><div style={{ fontSize: 14, fontWeight: 600 }}>{form.customer_email}</div></div>}
          </div>
          <div className="footer-bar">
            <button className="btn-primary" disabled={saving} onClick={handleClose}>{saving ? 'Saving...' : 'Confirm & close job ✓'}</button>
            <button className="btn-secondary" onClick={() => setStep(3)}>← back</button>
          </div>
        </>
      )}
    </div>
  )
}
