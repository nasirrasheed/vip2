import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const body = req.body;

  const message = typeof body === 'string'
    ? JSON.parse(body)?.message
    : body?.message;

  if (!message) {
    return res.status(400).json({ reply: "Message is required." });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return res.status(500).json({ reply: "AI error occurred." });
    }

    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn’t get that.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ reply: "Something went wrong." });
  }
}
