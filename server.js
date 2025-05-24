import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const TMDB_API_KEY =d932571ac3e721797d7f547ff74d3636 process.env.TMDB_API_KEY;
const OPENAI_API_KEY =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 process.env.OPENAI_API_KEY;

app.get('/films-recents', async (req, res) => {
  const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`);
  const data = await tmdbRes.json();
  res.json(data.results);
});

app.post('/generer-critique', async (req, res) => {
  const { titre } = req.body;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Tu es un critique de cinéma.' },
        { role: 'user', content: `Écris une critique courte et captivante du film "${titre}".` }
      ],
      max_tokens: 150,
      temperature: 0.8,
    }),
  });

  const openaiData = await openaiRes.json();
  const critique = openaiData.choices[0].message.content;
  res.json({ critique });
});

app.listen(3000, () => console.log('Serveur lancé sur http://localhost:3000'));
