const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const openaiResponse = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: req.body.prompt,
        max_tokens: 200,
    }, {
        headers: {
            'Authorization': `Bearer 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`
        }
    });
    res.json(openaiResponse.data);
});

app.use(express.static('public'));

app.listen(2000, () => {
    console.log('Server running on http://localhost:2000');
});
