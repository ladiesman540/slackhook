const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log('Incoming Request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  next();  // Important to call next() to continue the middleware chain
});

// Middleware to parse JSON requests
app.use(express.json());

app.post('/slack-webhook', async (req, res) => {
  const { type, challenge, event } = req.body;

  // Slack URL Verification
  if (type === 'url_verification') {
    return res.json({ challenge });
  }

  // Check if the event is a message in the specified channel
  if (event && event.type === 'message' && event.channel === 'C05A5M5MDD0') {
    console.log('Forwarding message from channel C05A5M5MDD0 to Zapier:', event);
  }

  // Forward the event to Zapier
  try {
    console.log('Forwarding to Zapier:', req.body);  // Log before forwarding
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
