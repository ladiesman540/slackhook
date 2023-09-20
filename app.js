const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

app.post('/slack-webhook', async (req, res) => {
  const { type, challenge } = req.body;

  // Slack URL Verification
  if (type === 'url_verification') {
    return res.json({ challenge });
  }

  // Forward the event to Zapier
  try {
    await axios.post('https://hooks.zapier.com/hooks/catch/14538814/3rjfh3t/', req.body);
  } catch (error) {
    console.error('Error forwarding to Zapier:', error);
  }

  // Respond to Slack
  res.status(200).end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});