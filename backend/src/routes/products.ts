import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

function toApiProduct(p: any) {
  return {
    id: p.id,
    name: { ru: p.nameRu, uz: p.nameUz, en: p.nameEn },
    size: p.size,
    cat: p.cat,
    cls: p.cls,
    img: p.img,
    price: p.price,
    tags: {
      ru: JSON.parse(p.tagsRu || '[]'),
      uz: JSON.parse(p.tagsUz || '[]'),
      en: JSON.parse(p.tagsEn || '[]'),
    },
    desc: { ru: p.descRu, uz: p.descUz, en: p.descEn },
    specs: {
      ru: JSON.parse(p.specsRu || '{}'),
      uz: JSON.parse(p.specsUz || '{}'),
      en: JSON.parse(p.specsEn || '{}'),
    },
  };
}

// GET all
router.get('/', async (_req, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { position: 'asc' },
    });
    res.json(products.map(toApiProduct));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// GET one
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const p = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(toApiProduct(p));
  } catch {
    res.status(500).json({ error: 'DB error' });
  }
});

// Admin middleware
function adminOnly(req: Request, res: Response, next: Function) {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// POST create
router.post('/', adminOnly, async (req: Request, res: Response) => {
  try {
    const d = req.body;
    const p = await prisma.product.create({
      data: {
        nameRu: d.nameRu, nameUz: d.nameUz || '', nameEn: d.nameEn || '',
        size: d.size, cat: d.cat, cls: d.cls || 'g1',
        img: d.img || '', price: d.price || '',
        tagsRu: typeof d.tagsRu === 'string' ? d.tagsRu : JSON.stringify(d.tagsRu || []),
        tagsUz: typeof d.tagsUz === 'string' ? d.tagsUz : JSON.stringify(d.tagsUz || []),
        tagsEn: typeof d.tagsEn === 'string' ? d.tagsEn : JSON.stringify(d.tagsEn || []),
        descRu: d.descRu || '', descUz: d.descUz || '', descEn: d.descEn || '',
        specsRu: typeof d.specsRu === 'string' ? d.specsRu : JSON.stringify(d.specsRu || {}),
        specsUz: typeof d.specsUz === 'string' ? d.specsUz : JSON.stringify(d.specsUz || {}),
        specsEn: typeof d.specsEn === 'string' ? d.specsEn : JSON.stringify(d.specsEn || {}),
        position: d.position || 0,
      },
    });
    res.status(201).json(toApiProduct(p));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// PUT update
router.put('/:id', adminOnly, async (req: Request, res: Response) => {
  try {
    const d = req.body;
    const p = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        nameRu: d.nameRu, nameUz: d.nameUz, nameEn: d.nameEn,
        size: d.size, cat: d.cat, cls: d.cls,
        img: d.img, price: d.price,
        tagsRu: typeof d.tagsRu === 'string' ? d.tagsRu : JSON.stringify(d.tagsRu || []),
        tagsUz: typeof d.tagsUz === 'string' ? d.tagsUz : JSON.stringify(d.tagsUz || []),
        tagsEn: typeof d.tagsEn === 'string' ? d.tagsEn : JSON.stringify(d.tagsEn || []),
        descRu: d.descRu, descUz: d.descUz, descEn: d.descEn,
        specsRu: typeof d.specsRu === 'string' ? d.specsRu : JSON.stringify(d.specsRu || {}),
        specsUz: typeof d.specsUz === 'string' ? d.specsUz : JSON.stringify(d.specsUz || {}),
        specsEn: typeof d.specsEn === 'string' ? d.specsEn : JSON.stringify(d.specsEn || {}),
        active: d.active ?? true,
        position: d.position,
      },
    });
    res.json(toApiProduct(p));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// DELETE
router.delete('/:id', adminOnly, async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'DB error' });
  }
});

export default router;
