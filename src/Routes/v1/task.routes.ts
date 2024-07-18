import { Router } from 'express';
import { create, findById, update, remove, get, updateStatus } from '../../Controllers/Task.controller';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { verifyAccessToken } from '../../middlewares/verifyAccessToken';

const router = Router();

router.post('/', verifyAccessToken, asyncWrapper(create));
router.get('/user', verifyAccessToken, asyncWrapper(get));
router.get('/:id', verifyAccessToken, asyncWrapper(findById));
router.put('/:id', verifyAccessToken, asyncWrapper(update));
router.patch('/:id', verifyAccessToken, asyncWrapper(remove));
router.patch('/:id/status', verifyAccessToken, asyncWrapper(updateStatus));

export default router;
