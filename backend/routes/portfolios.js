const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const { z } = require('zod');

const prisma = new PrismaClient();

const portfolioSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  longDescription: z.string().optional(),
  category: z.enum(['FULL_STACK', 'WEB_DEVELOPER', 'UI_UX_DESIGNER', 'DATA_SCIENTIST']),
  price: z.number().min(0),
  tier: z.enum(['FREE', 'PRO', 'AGENCY']),
  previewUrl: z.string().url().optional(),
  imageUrl: z.string().url(),
  techStack: z.array(z.string()),
  featured: z.boolean().optional(),
});

// GET /api/portfolios
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, tier, sort = 'rating', search, page = 1, limit = 12 } = req.query;

    const where = {};
    if (category) where.category = category;
    if (tier) where.tier = tier;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy = {};
    if (sort === 'rating') orderBy.rating = 'desc';
    else if (sort === 'price_asc') orderBy.price = 'asc';
    else if (sort === 'price_desc') orderBy.price = 'desc';
    else if (sort === 'newest') orderBy.createdAt = 'desc';
    else if (sort === 'downloads') orderBy.downloads = 'desc';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [portfolios, total] = await Promise.all([
      prisma.portfolio.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          reviews: {
            take: 3,
            include: { user: { select: { name: true, image: true } } },
          },
          _count: { select: { purchases: true } },
        },
      }),
      prisma.portfolio.count({ where }),
    ]);

    res.json({
      portfolios,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch portfolios' });
  }
});

// GET /api/portfolios/featured
router.get('/featured', async (req, res) => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { featured: true },
      take: 6,
      orderBy: { rating: 'desc' },
    });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured portfolios' });
  }
});

// GET /api/portfolios/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: req.params.id },
      include: {
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { purchases: true } },
      },
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Check if user has purchased
    let hasPurchased = false;
    if (req.user) {
      const purchase = await prisma.purchase.findFirst({
        where: { userId: req.user.id, portfolioId: portfolio.id },
      });
      hasPurchased = !!purchase;
    }

    res.json({ ...portfolio, hasPurchased });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// POST /api/portfolios (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = portfolioSchema.parse(req.body);
    const portfolio = await prisma.portfolio.create({ data });
    res.status(201).json(portfolio);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create portfolio' });
  }
});

// PUT /api/portfolios/:id (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = portfolioSchema.partial().parse(req.body);
    const portfolio = await prisma.portfolio.update({
      where: { id: req.params.id },
      data,
    });
    res.json(portfolio);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// DELETE /api/portfolios/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.portfolio.delete({ where: { id: req.params.id } });
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
});

// POST /api/portfolios/:id/reviews
router.post('/:id/reviews', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment required' });
    }

    const existing = await prisma.review.findFirst({
      where: { userId: req.user.id, portfolioId: req.params.id },
    });
    if (existing) {
      return res.status(409).json({ error: 'You have already reviewed this portfolio' });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        portfolioId: req.params.id,
        rating: parseInt(rating),
        comment,
      },
      include: { user: { select: { name: true, image: true } } },
    });

    // Update portfolio average rating
    const reviews = await prisma.review.findMany({
      where: { portfolioId: req.params.id },
    });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await prisma.portfolio.update({
      where: { id: req.params.id },
      data: { rating: Math.round(avgRating * 10) / 10, ratingCount: reviews.length },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

module.exports = router;
