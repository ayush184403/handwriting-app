import { supabase } from './supabase'

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

// ─── UPGRADE USER IN DATABASE ─────────────────────────────────────────────────
// Called after successful payment — sets limit to 999 (effectively unlimited)

export async function upgradeUserInDatabase(deviceId) {
  const { data, error } = await supabase
    .from('usage_tracking')
    .update({
      assignments_limit: 999,
    })
    .eq('device_id', deviceId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── OPEN RAZORPAY CHECKOUT ───────────────────────────────────────────────────

export function openRazorpayCheckout({ deviceId, onSuccess, onFailure }) {
  alert('Key is: ' + RAZORPAY_KEY_ID)
    // Make sure the Razorpay script loaded
  if (!window.Razorpay) {
    alert('Payment system failed to load. Please refresh and try again.')
    return
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: 9900,              // amount in paise (9900 paise = ₹99)
    currency: 'INR',
    name: 'WriteAI',
    description: 'Unlimited Handwriting Assignments',
    image: '',                 // optional: your logo URL

    // ── Handler called on successful payment ──
    handler: async function (response) {
      // response contains:
      // response.razorpay_payment_id  — proof of payment
      // response.razorpay_order_id
      // response.razorpay_signature

      try {
        // Upgrade the user's limit in Supabase
        const updated = await upgradeUserInDatabase(deviceId)
        onSuccess(updated)
      } catch (err) {
        onFailure('Payment succeeded but upgrade failed. Contact support with payment ID: ' + response.razorpay_payment_id)
      }
    },

    // ── Pre-fill contact info (optional) ──
    prefill: {
      name: '',
      email: '',
      contact: '',
    },

    // ── UI options ──
    theme: {
      color: '#4F46E5',        // indigo to match your app
    },

    // ── Called when user closes the modal without paying ──
    modal: {
      ondismiss: function () {
        console.log('Payment dismissed')
      }
    }
  }

  const rzp = new window.Razorpay(options)

  // Handle payment failures
  rzp.on('payment.failed', function (response) {
    onFailure(response.error.description)
  })

  rzp.open()
}