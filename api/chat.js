export default async function handler(req, res) {
  const body = await req.body || '';

  let message = '';

  try {
    const parsed = JSON.parse(body);
    message = parsed.message;
  } catch (e) {
    return res.status(400).json({ reply: 'Invalid request.' });
  }

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    }),
  });

  const data = await openaiRes.json();
  const reply = data?.choices?.[0]?.message?.content || 'Sorry, I couldn’t get that.';

  res.status(200).json({ reply });
}
