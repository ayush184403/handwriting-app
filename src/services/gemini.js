const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`

export async function rewriteAsStudent(rawText, subject = 'General') {
  const prompt = `
You are helping a student submit a handwritten assignment.

Rewrite the following text so it sounds like it was written by a real student aged 14–16:
- Use slightly imperfect but clear sentence structure
- Vary sentence length — some short, some longer
- Include minor but natural phrasing (like "This basically means..." or "In other words...")
- Do NOT use bullet points or numbered lists — write in paragraphs only
- Do NOT add an introduction like "Here is the rewritten text"
- Keep the subject matter accurate — do not change facts
- Match the subject tone: ${subject} assignment
- Length should be similar to the input

Text to rewrite:
"""
${rawText}
"""

Output only the rewritten student text, nothing else.
`

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2048,
      }
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error?.error?.message || 'Gemini API request failed')
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}