import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id, email: user.email });

    // Don't send password back to client
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    };

    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};
