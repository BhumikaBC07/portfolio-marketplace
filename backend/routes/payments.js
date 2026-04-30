const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const prisma = new PrismaClient();

// POST /api/payments/checkout
router.post('/checkout', authenticate, async (req, res) => {
  try {
    const { portfolioId } = req.body;

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    if (portfolio.price === 0) {
      return res.status(400).json({ error: 'This portfolio is free' });
    }

    // Check if already purchased
    const existing = await prisma.purchase.findFirst({
      where: { userId: req.user.id, portfolioId },
    });
    if (existing) {
      return res.status(409).json({ error: 'Already purchased' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: portfolio.title,
              description: portfolio.description,
              images: [portfolio.imageUrl],
            },
            unit_amount: Math.round(portfolio.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/portfolios/${portfolioId}?cancelled=true`,
      metadata: {
        userId: req.user.id,
        portfolioId,
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// GET /api/payments/verify
router.get('/verify', authenticate, async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    const purchase = await prisma.purchase.findUnique({
      where: { stripeSessionId: session_id },
      include: { portfolio: true },
    });

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.json({ verified: true, purchase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// POST /api/payments/webhook
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, portfolioId } = session.metadata;

    try {
      // Create purchase record
      await prisma.purchase.create({
        data: {
          userId,
          portfolioId,
          stripeSessionId: session.id,
          amount: session.amount_total / 100,
        },
      });

      // Increment download count
      await prisma.portfolio.update({
        where: { id: portfolioId },
        data: { downloads: { increment: 1 } },
      });

      // Upgrade user plan if needed
      const portfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } });
      if (portfolio) {
        const planHierarchy = { FREE: 0, PRO: 1, AGENCY: 2 };
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (planHierarchy[portfolio.tier] > planHierarchy[user.plan]) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: portfolio.tier },
          });
        }
      }

      console.log(`✅ Purchase recorded for user ${userId}, portfolio ${portfolioId}`);
    } catch (error) {
      console.error('Failed to record purchase:', error);
    }
  }

  res.json({ received: true });
});

module.exports = router;
