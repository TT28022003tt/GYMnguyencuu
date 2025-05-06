import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const googleApiKey = process.env.GOOGLE_API_KEY;

if (!googleApiKey) {
  throw new Error('Missing GOOGLE_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(googleApiKey);

app.post('/api/chat', async (req: Request, res: Response) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err: any) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'Lỗi khi gọi Gemini API' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Gemini server running on port ${PORT}`));
