import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.model';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.SECRET_KEY!, {
    expiresIn: '1h',
  });
};

router.post(
  '/signup',
  [
    body('emailAddress').isEmail().normalizeEmail(),
    body('pass').isLength({ min: 8 }),
    body('first').trim().notEmpty(),
    body('last').trim().notEmpty(),
    body('phone').trim().notEmpty(),
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ validationErrors: errors.array() });
      }

      const { emailAddress, pass, first, last, phone, userRole, location } = req.body;

      const existingUser = await User.findOne({ email: emailAddress });
      if (existingUser) {
        return res.status(409).json({ err: 'Account already exists', code: 409 });
      }

      const user = new User({
        email: emailAddress,
        password: pass,
        firstName: first,
        lastName: last,
        phoneNumber: phone,
        role: userRole || 'tenant',
        address: location,
      });

      await user.save();

      const token = generateToken(user._id.toString());
      const userWithoutPassword: any = user.toObject();
      delete userWithoutPassword.password;

      res.status(201).json({
        msg: 'Account created',
        account: userWithoutPassword,
        accessToken: token,
        ok: true,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ err: 'Internal error', code: 500 });
    }
  }
);

router.post(
  '/signin',
  [
    body('userEmail').isEmail().normalizeEmail(),
    body('userPassword').notEmpty(),
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ validationErrors: errors.array() });
      }

      const { userEmail, userPassword } = req.body;

      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(401).json({ err: 'Bad credentials', code: 401 });
      }

      const isPasswordValid = await user.comparePassword(userPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ err: 'Bad credentials', code: 401 });
      }

      if (!user.isActive) {
        return res.status(403).json({ err: 'Account suspended', code: 403 });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id.toString());
      const userWithoutPassword: any = user.toObject();
      delete userWithoutPassword.password;

      res.json({
        msg: 'Authenticated',
        account: userWithoutPassword,
        accessToken: token,
        ok: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ err: 'Internal error', code: 500 });
    }
  }
);

router.get('/current-user', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('properties');

    if (!user) {
      return res.status(404).json({ err: 'Account not found', code: 404 });
    }

    res.json({ currentAccount: user, ok: true });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ err: 'Internal error', code: 500 });
  }
});

router.put('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.email;
    delete updates.role;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put(
  '/change-password',
  authenticateToken,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
  async (req: AuthRequest, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post('/signout', authenticateToken, async (req: AuthRequest, res: any) => {
  res.json({ msg: 'Session terminated', ok: true });
});

router.post('/refresh-token', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const token = generateToken(req.userId!);
    res.json({ token });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;