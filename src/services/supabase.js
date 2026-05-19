import { createClient } from '@supabase/supabase-js'

// Connect to your Supabase project using the env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── DEVICE ID ───────────────────────────────────────────────────────────────
// We identify each browser with a random ID stored in localStorage.
// This isn't foolproof (user can clear it) but it's fine for an MVP.

function getDeviceId() {
  let id = localStorage.getItem('writeai_device_id')
  if (!id) {
    // Generate a random ID and save it permanently in this browser
    id = 'device_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('writeai_device_id', id)
  }
  return id
}

// ─── GET USAGE ────────────────────────────────────────────────────────────────
// Fetch (or create) the usage record for this device.

export async function getUsage() {
  const deviceId = getDeviceId()

  const { data, error } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('device_id', deviceId)
    .maybeSingle()

  if (data) return data

  // No record found — try to create one
  const { data: newData, error: insertError } = await supabase
    .from('usage_tracking')
    .upsert(
      { device_id: deviceId, assignments_used: 0, assignments_limit: 3 },
      { onConflict: 'device_id' }   // if it already exists, just return it
    )
    .select()
    .maybeSingle()

  if (insertError) throw insertError
  return newData
}

// ─── INCREMENT USAGE ──────────────────────────────────────────────────────────
// Add 1 to the assignments_used count for this device.

export async function incrementUsage() {
  const deviceId = getDeviceId()

  const { data, error } = await supabase
    .from('usage_tracking')
    .update({
      assignments_used: (await getUsage()).assignments_used + 1,
      last_used_at: new Date().toISOString()
    })
    .eq('device_id', deviceId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── SAVE ASSIGNMENT ──────────────────────────────────────────────────────────
// Store the generated assignment in the database.

export async function saveAssignment(originalText, rewrittenText, subject) {
  const deviceId = getDeviceId()

  const { error } = await supabase
    .from('assignments')
    .insert({
      device_id: deviceId,
      original_text: originalText,
      rewritten_text: rewrittenText,
      subject: subject
    })

  if (error) throw error
}

// ─── CHECK IF CAN GENERATE ────────────────────────────────────────────────────
// Returns true if the user has assignments remaining.

export async function canGenerate() {
  const usage = await getUsage()
  return usage.assignments_used < usage.assignments_limit
}
// Export so App.jsx can pass it to payment flow
export function getDeviceIdPublic() {
  return localStorage.getItem('writeai_device_id') || ''
}