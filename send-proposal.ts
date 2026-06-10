import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { proposalId } = req.body
  if (!proposalId) return res.status(400).json({ error: 'Missing proposalId' })

  const { data: proposal } = await supabase.from('proposals').select('*').eq('id', proposalId).single()
  if (!proposal) return res.status(404).json({ error: 'Proposal not found' })

  const { data: system } = await supabase.from('systems').select('*').eq('id', proposal.selected_system_id).single()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', proposal.profile_id).single()

  let addonsHtml = ''
  if (proposal.selected_addons?.length > 0) {
    const { data: adds } = await supabase.from('addons').select('*').in('id', proposal.selected_addons)
    if (adds) {
      addonsHtml = adds.map(a => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #555;">${a.name}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #555; text-align: right;">+$${a.price.toLocaleString()}</td>
        </tr>
      `).join('')
    }
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; padding: 0; background: #f5f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; padding: 32px 16px;">
        
        <div style="background: #D85A30; border-radius: 12px 12px 0 0; padding: 24px 28px;">
          <div style="font-size: 22px; font-weight: 800; color: white; letter-spacing: -0.3px;">⚡ FieldClose</div>
          <div style="font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 4px;">${profile?.company_name || 'Your HVAC Company'}</div>
        </div>

        <div style="background: white; border-radius: 0 0 12px 12px; padding: 28px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #111; margin: 0 0 8px;">Your HVAC Proposal</h2>
          <p style="font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 24px;">Hi ${proposal.customer_name}, thank you for having us out today. Here is a summary of your proposal from ${profile?.company_name || 'our team'}.</p>

          <div style="background: #f9f9f7; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
            <div style="font-size: 12px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">Job Details</div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; color: #888;">Address</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; color: #111; text-align: right;">${proposal.address}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; color: #888;">System age</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; color: #111; text-align: right;">${proposal.system_age}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #888;">Diagnosis</td>
                <td style="padding: 8px 0; font-size: 13px; color: #111; text-align: right;">${proposal.diagnosis}</td>
              </tr>
            </table>
          </div>

          <div style="background: #f9f9f7; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
            <div style="font-size: 12px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">Selected Option</div>
            <div style="font-size: 17px; font-weight: 700; color: #111; margin-bottom: 4px;">${system?.name || 'System'}</div>
            <div style="font-size: 13px; color: #888; margin-bottom: 16px;">${system?.description || ''}</div>
            <table style="width: 100%; border-collapse: collapse;">
              ${addonsHtml}
              <tr>
                <td style="padding: 12px 0 0; font-size: 16px; font-weight: 700; color: #111;">Total</td>
                <td style="padding: 12px 0 0; font-size: 20px; font-weight: 800; color: #D85A30; text-align: right;">$${proposal.total_price?.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          ${proposal.notes ? `<div style="background: #fff8f0; border: 1px solid #f0d0b0; border-radius: 10px; padding: 16px; margin-bottom: 24px;"><div style="font-size: 12px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">Tech Notes</div><div style="font-size: 14px; color: #555; line-height: 1.6;">${proposal.notes}</div></div>` : ''}

          <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 13px; color: #888; line-height: 1.6;">
            Questions about your proposal? Reply to this email or contact us directly.<br><br>
            <strong style="color: #111;">${profile?.owner_name || 'The Team'}</strong><br>
            ${profile?.company_name || ''}<br>
            ${profile?.phone ? `📞 ${profile.phone}` : ''}
          </div>
        </div>

        <div style="text-align: center; padding: 20px; font-size: 12px; color: #aaa;">
          Powered by ⚡ FieldClose
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: 'FieldClose <proposals@fieldclose.net>',
      to: proposal.customer_email,
      subject: `Your HVAC proposal from ${profile?.company_name || 'your technician'} — $${proposal.total_price?.toLocaleString()}`,
      html: emailHtml,
    })
    await supabase.from('proposals').update({ status: 'sent' }).eq('id', proposalId)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
}
