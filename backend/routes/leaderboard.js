import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GAME 1: GET /api/leaderboard?difficulty=3x4 (or all)
router.get('/', async (req, res) => {
  try {
    const diff = req.query.difficulty;
    let sql = `
      SELECT username, difficulty, time, moves, created_at AS date
      FROM game_match
      ORDER BY time ASC, created_at ASC
    `;
    const values = [];

    if (diff && diff !== 'all') {
      sql = `
        SELECT username, difficulty, time, moves, created_at AS date
        FROM game_match
        WHERE difficulty = $1
        ORDER BY time ASC, created_at ASC
      `;
      values.push(diff);
    }

    const { rows } = await pool.query(sql, values);
    res.json(rows);
  } catch (err) {
    console.error('GET game_match error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GAME 1: POST /api/leaderboard
router.post('/', async (req, res) => {
  const { username, difficulty, time, moves } = req.body;

  if (!username || !difficulty || time == null || moves == null) {  // ← FIXED LOGIC
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO game_match (username, difficulty, time, moves)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [username, difficulty, Number(time), Number(moves)]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST game_match error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GAME 2: POST /api/leaderboard/game2
router.post('/game2', async (req, res) => {
  const { username, level } = req.body;

  if (!username || level == null || level < 1) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO advanced (username, level)
       VALUES ($1, $2)
       RETURNING *`,
      [username, Number(level)]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST advanced error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/leaderboard/game2 → Advanced Match leaderboard
router.get('/game2', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT username, level, created_at AS date
      FROM advanced
      ORDER BY level DESC, created_at ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET advanced error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;