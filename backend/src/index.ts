import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import prisma from './lib/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// Admin: get all orders
app.get('/api/admin/orders', (req, res) => {
  if (req.headers['x-admin-token'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  prisma.order.findMany({ orderBy: { createdAt: 'desc' } })
    .then(orders => res.json(orders))
    .catch(() => res.status(500).json({ error: 'DB error' }));
});

// Admin: update order status
app.patch('/api/admin/orders/:id', (req, res) => {
  if (req.headers['x-admin-token'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  prisma.order.update({
    where: { id: req.params.id },
    data: { status: req.body.status },
  })
    .then(o => res.json(o))
    .catch(() => res.status(500).json({ error: 'DB error' }));
});

// Seed on startup
async function seedIfEmpty() {
  const count = await prisma.product.count();
  if (count === 0) {
    const { main } = await import('./data/seed');
    // seed is self-running, just log
    console.log('Seeding products...');
  }
}

app.listen(PORT, async () => {
  console.log(`✅ APS backend on port ${PORT}`);
  await seedIfEmpty().catch(console.error);
});
