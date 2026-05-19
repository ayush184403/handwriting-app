export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET

  if (!key_id || !key_secret) {
    return res.status(500).json({ error: 'Razorpay keys not configured' })
  }

  try {
    // Create a Razorpay order using their REST API directly
    const credentials = Buffer.from(`${key_id}:${key_secret}`).toString('base64')

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 9900,        // ₹99 in paise
        currency: 'INR',
        receipt: 'writeai_' + Date.now(),
      })
    })

    const order = await response.json()

    if (!response.ok) {
      return res.status(500).json({ error: order.error?.description || 'Order creation failed' })
    }

    return res.status(200).json({ orderId: order.id })

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}