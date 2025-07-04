const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow requests from your Angular frontend
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Replace these with your actual credentials
const GOOGLE_CLIENT_ID = '511891274934-a4d78n8vjouhj7bvvr76f1emvt29cbn0.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

app.post('/api/google-token', async (req, res) => {
  const {
    code,
    redirect_uri,
    code_verifier
  } = req.body;

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirect_uri);
    params.append('client_id', GOOGLE_CLIENT_ID);
    params.append('client_secret', GOOGLE_CLIENT_SECRET);
    params.append('code_verifier', code_verifier);

    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.post('/api/google-refresh-token', async (req, res) => {
  const { refresh_token } = req.body;

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);
    params.append('client_id', GOOGLE_CLIENT_ID);
    params.append('client_secret', GOOGLE_CLIENT_SECRET);

    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
