import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import prisma from './lib/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (
      origin.endsWith('.vercel.app') ||
      origin.startsWith('http://localhost') ||
      origin === (process.env.FRONTEND_URL || '')
    ) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.get('/api/admin/orders', (req, res) => {
  if (req.headers['x-admin-token'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  prisma.order.findMany({ orderBy: { createdAt: 'desc' } })
    .then(orders => res.json(orders))
    .catch(() => res.status(500).json({ error: 'DB error' }));
});

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

app.listen(PORT, async () => {
  console.log('✅ APS backend on port ' + PORT);
});
