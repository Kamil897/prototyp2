import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { CreateOrderDto } from '../types';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const body = req.body as CreateOrderDto;

  if (!body.name || !body.phone) {
    return res.status(400).json({ error: 'name and phone are required' });
  }

  try {
    const order = await prisma.order.create({
      data: {
        name: body.name.trim(),
        phone: body.phone.trim(),
        product: body.product?.trim() || '',
        volume: body.volume?.trim() || '',
        comment: body.comment?.trim() || '',
      },
    });
    console.log('[ORDER SAVED]', order.id, order.name);
    res.status(201).json({ success: true, id: order.id });
  } catch (err) {
    console.error('[ORDER ERROR]', err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;

router.delete('/:id', (req: Request, res: Response) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  prisma.order.delete({ where: { id: req.params.id } })
    .then(() => res.json({ success: true }))
    .catch(() => res.status(500).json({ error: 'DB error' }));
});
