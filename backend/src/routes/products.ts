import { Router, Request, Response } from 'express';
import { products } from '../data/products';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json(products);
});

router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

export default router;
