require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { kv } = require('@vercel/kv'); // Import Vercel KV
const Redis = require('ioredis');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let redisClient = null;
if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL);
}

const PROBLEMS_FILE = path.join(__dirname, 'problems.json');
const upload = multer({ dest: '/tmp/' }); // Use /tmp/ for serverless environments (Vercel)

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

const GET_RECENT_SUBMISSIONS = `
query getRecentSubmissions($username: String!) {
  recentAcSubmissionList(username: $username, limit: 50) {
    title
    titleSlug
    timestamp
  }
}
`;

// Default fallback problems
const DEFAULT_PROBLEMS = [
  { "title": "Two Sum", "slug": "two-sum", "difficulty": "Easy" },
  { "title": "Add Two Numbers", "slug": "add-two-numbers", "difficulty": "Medium" },
  { "title": "Longest Substring Without Repeating Characters", "slug": "longest-substring-without-repeating-characters", "difficulty": "Medium" }
];

// Helper to get problems: From Vercel KV (production) or local JSON fallback
async function getProblems() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const data = await kv.get('leetcode_tracked_problems');
    return data || DEFAULT_PROBLEMS;
  }
  
  if (redisClient) {
    const data = await redisClient.get('leetcode_tracked_problems');
    return data ? JSON.parse(data) : DEFAULT_PROBLEMS;
  }
  
  // Local file fallback
  if (fs.existsSync(PROBLEMS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROBLEMS_FILE, 'utf-8'));
    } catch {
      return DEFAULT_PROBLEMS;
    }
  }
  return DEFAULT_PROBLEMS;
}

// Helper to save problems
async function saveProblems(newProblems) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    await kv.set('leetcode_tracked_problems', newProblems);
  } else if (redisClient) {
    await redisClient.set('leetcode_tracked_problems', JSON.stringify(newProblems));
  } else {
    try {
      fs.writeFileSync(PROBLEMS_FILE, JSON.stringify(newProblems, null, 2));
    } catch (err) {
      console.warn("Could not save to local filesystem (likely Vercel environment without KV database configured). This will not persist across restarts.");
    }
  }
}

app.get('/problems', async (req, res) => {
  const problems = await getProblems();
  res.json(problems);
});

app.post('/problems/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Validate and format the extracted data
    const newProblems = data.map(row => {
      const title = row.title || row.Title;
      const rawSlug = row.slug || row.titleSlug || row.Slug || (title ? title.toLowerCase().replace(/ /g, '-') : '');
      return {
        title,
        slug: rawSlug.toString().trim().toLowerCase(),
        difficulty: row.difficulty || row.Difficulty || 'Easy'
      };
    }).filter(p => p.title && p.slug);

    if (newProblems.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "No valid problems found in the file. Ensure columns 'title', 'slug', and 'difficulty' exist." });
    }

    await saveProblems(newProblems);
    fs.unlinkSync(req.file.path); // Clean up upload

    res.json({ message: "Problems updated successfully", problems: newProblems });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error(error);
    res.status(500).json({ error: "Failed to process the uploaded file." });
  }
});

app.get('/check/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const response = await axios.post(LEETCODE_GRAPHQL_URL, {
      query: GET_RECENT_SUBMISSIONS,
      variables: { username }
    });

    const submissions = response.data.data.recentAcSubmissionList;

    if (!submissions) {
      return res.status(404).json({ error: "User not found or has no recent submissions." });
    }

    const solvedSlugs = new Set(submissions.map(s => s.titleSlug));
    const problems = await getProblems();

    const results = problems.map(p => ({
      title: p.title,
      difficulty: p.difficulty,
      status: solvedSlugs.has(p.slug) ? "Solved" : "Not Solved"
    }));

    const solvedCount = results.filter(r => r.status === "Solved").length;
    const totalCount = problems.length;
    const percentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

    res.json({
      username,
      total: totalCount,
      solved: solvedCount,
      percentage,
      results
    });

  } catch (error) {
    console.error('Error fetching data from LeetCode:', error.message);
    res.status(500).json({ error: "Failed to fetch data from LeetCode API." });
  }
});

// Start the server if running locally, otherwise export for Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
