import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, findUserByEmail, findUserByUsername } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (findUserByEmail(email)) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    if (findUserByUsername(username)) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = createUser({
      username,
      email,
      password: hashedPassword,
      profileUrl: username,
    });

    res.status(201).json({ message: 'User created successfully', user: { ...newUser, password: undefined } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}