const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Path to compiled Angular production build
const distPath = path.join(__dirname, '../app/dist/app/browser');

// Serve static assets
app.use(express.static(distPath));

// Angular SPA fallback - serve index.html for client-side routes such as /analytics
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`MorTrack server running on http://localhost:${PORT}`);
});
