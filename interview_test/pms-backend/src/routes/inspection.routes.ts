import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'inspection routes' }));
export default router;
