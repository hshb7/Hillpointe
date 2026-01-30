import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'analytics routes' }));
export default router;
