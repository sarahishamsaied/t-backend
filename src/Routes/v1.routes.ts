import { Router } from 'express';

import userRoutes from './v1/user.routes';
import taskRoutes from './v1/task.routes';
import categoryRoutes from './v1/task.routes';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';
import { asyncWrapper } from '../utils/asyncWrapper';

const router = Router();

router.use('/user', userRoutes);
router.use('/task', asyncWrapper(verifyAccessToken), taskRoutes);
router.use('/category', asyncWrapper(verifyAccessToken), categoryRoutes);

export default router;
