import { Request, Response, Router } from 'express';
import { userRouter } from './user';
import { categoryRouter } from './category';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).render('home');
});

router.use('/user', userRouter);
router.use('/category', categoryRouter);

export default router;
