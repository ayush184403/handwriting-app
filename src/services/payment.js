import { supabase } from './supabase'

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

export async function upgradeUserInDatabase(deviceId) {
  const { data, error } = await supabase
    .from('usage_tracking')
    .update({ assignments_limit: 999 })
    .eq('device_id', deviceId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Create order from our backend
async function createOrder() {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error || 'Could not create order')
  }

  const data = await response.json()
  return data.orderId
}

export function openRazorpayCheckout({ deviceId, onSuccess, onFailure }) {
  if (!window.Razorpay) {
    alert('Payment system failed to load. Please refresh.')
    return
  }

  // First create the order, then open checkout
  createOrder()
    .then((orderId) => {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: 9900,
        currency: 'INR',
        name: 'WriteAI',
        description: 'Unlimited Handwriting Assignments',
        order_id: orderId,           // ← this is what makes it work on deployed
        theme: { color: '#4F46E5' },
        handler: async function (response) {
          try {
            const updated = await upgradeUserInDatabase(deviceId)
            onSuccess(updated)
          } catch (err) {
            onFailure('Payment succeeded but upgrade failed. Payment ID: ' + response.razorpay_payment_id)
          }
        },
        modal: {
          ondismiss: function () {
            console.log('dismissed')
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (r) => onFailure(r.error.description))
      rzp.open()
    })
    .catch((err) => {
      onFailure('Could not start payment: ' + err.message)
    })
}