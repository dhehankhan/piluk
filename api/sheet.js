export default async function handler(req, res) {
  // ✅ Your Google Sheet published CSV link
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQtBcVSk6lw6LbrnqyTaP_omTx64wFqQBabE8nI-L7qNt8wUpmhRd7VnCWqQKTDeunRgj7v8NYAkdCy/pub?gid=1050908529&single=true&output=csv';

  // Allow the website to call this function
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  try {
    const response = await fetch(SHEET_URL + '&t=' + Date.now());

    if (!response.ok) {
      return res.status(500).json({ error: `Sheet returned HTTP ${response.status}. Make sure your sheet is Published to Web as CSV.` });
    }

    const csv = await response.text();

    if (!csv || csv.trim().startsWith('<')) {
      return res.status(500).json({ error: 'Sheet returned HTML instead of CSV. Go to File → Share → Publish to web → CSV and publish again.' });
    }

    res.setHeader('Content-Type', 'text/csv');
    return res.status(200).send(csv);

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch sheet: ' + err.message });
  }
}
