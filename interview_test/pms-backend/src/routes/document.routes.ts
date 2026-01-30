import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'document routes' }));
export default router;
