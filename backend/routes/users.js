const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const prisma = new PrismaClient();

// GET /api/user/dashboard
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        role: true,
        createdAt: true,
        purchases: {
          include: {
            portfolio: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          include: { portfolio: { select: { title: true } } },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { purchases: true, reviews: true } },
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// PUT /api/user/profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, image } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, image },
      select: { id: true, name: true, email: true, image: true, plan: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
