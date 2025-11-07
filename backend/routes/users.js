import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // hash the password before storing
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);


    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === '23505') {
      res.status(409).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required'});
    }

    try {
        // check if user exists
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', 
            [email]
        );
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error : 'Invalid email or password' });
        }

        const user = userResult.rows[0];

        // compare provided password with the hashed one
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // remove password from response
        delete user.password

        res.json({
            message: 'Login successful',
            user
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;