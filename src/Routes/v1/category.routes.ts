import { Router } from 'express';
import { create, findById, update, remove, getTasksByCategoryId, get } from '../../Controllers/Categories.controller';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { verifyAccessToken } from '../../middlewares/verifyAccessToken';

const router = Router();

router.post('/', verifyAccessToken, asyncWrapper(create));
router.post('/', verifyAccessToken, asyncWrapper(get));
router.get('/:id', verifyAccessToken, asyncWrapper(findById));
router.put('/:id', verifyAccessToken, asyncWrapper(update));
router.delete('/:id', verifyAccessToken, asyncWrapper(remove));
router.get('/:id/tasks', verifyAccessToken, asyncWrapper(getTasksByCategoryId));

export default router;
