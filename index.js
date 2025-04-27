// index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // so /mcp.json is served

// Endpoint to fetch recent tokens
app.get('/api/recent-tokens', async (req, res) => {
  try {
    const response = await axios.get('https://api.dexscreener.io/latest/dex/tokens');
    const tokens = response.data.pairs
      .filter(pair => pair.chainId === "monad-testnet") // adjust if needed
      .sort((a, b) => b.fdvUsd - a.fdvUsd) // sort by market cap (fully diluted valuation)
      .slice(0, 10); // top 10 tokens

    res.json(tokens);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch token data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
