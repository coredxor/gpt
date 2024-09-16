const express = require('express');
require('dotenv').config();
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/api/hello', async (req, res) => {
    res.send('Hello from CodeTea.io!');
});

app.post('/api/stream', async (req, res) => {
    try {
        console.log("BonX: start stream")
        const { messages, maxTokens, temperature = 0.3 } = req.body;
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: messages,
                temperature: temperature,
                maxTokens: maxTokens,
                stream: true
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'stream'
            }
        );
        res.setHeader('Content-Type', 'text/plain');
        response.data.on('data', (chunk) => {
            res.write(chunk);
        });
        response.data.on('end', () => {
            res.end();
        });
        response.data.on('error', (err) => {
            console.error('Stream error:', err);
            res.status(500).send('Stream error');
        });
    } catch (error) {
        console.error('Request failed:', error);
        res.status(500).send('Request failed');
    }
});

app.post('/api/gpt', async (req, res) => {
    try {
        console.log("BonX: ","dfdf")
        const { messages, maxTokens, temperature = 0.7 } = req.body;
        const body = {
            model: 'gpt-4o', // or 'gpt-4' depending on your access
            messages: messages,
            max_tokens: maxTokens,
            temperature: temperature,
        }
        console.log("BonX:bodybodybody ",JSON.stringify(body))
        const completion = await openai.chat.completions.create(body);
        res.json({ response: completion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
