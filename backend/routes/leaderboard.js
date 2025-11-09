import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GAME 1
// GET /api/leaderbaord?difficulty=4x4 (or all)
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
            ORDER BY time ASC, cretead_at ASC
            `;
            values.push(diff)
        }

        const { rows } = await pool.query(sql, values);
        res.json(rows);
    } catch (err) {
        console.error('GET game_match error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/leaderboard (Game 1 score)
router.post('/', async (req, res) => {
    const { username, difficulty, time, moves } = req.body;

    if (!username || !difficulty || !time == null || moves == null) {
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
})