// user.routes.ts

import { Router } from 'express';

import { create, findById, findByEmail, update, deleteUser, login, reactivateUser } from '../../Controllers/User.controller';
import { verifyAccessToken } from '../../middlewares/verifyAccessToken';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { validateUserSignInData, validateUserSignUpData } from '../../middlewares/validateUser';
import { isAuthorized } from '../../middlewares/authorized';

const router = Router();

router.post('/auth/register', validateUserSignUpData, asyncWrapper(create));
router.post('/auth/login', validateUserSignInData, asyncWrapper(login));
router.get('/:id', asyncWrapper(verifyAccessToken), asyncWrapper(findById));
router.get('/email/:email', asyncWrapper(findByEmail));
router.put('/:id', asyncWrapper(verifyAccessToken), asyncWrapper(isAuthorized), asyncWrapper(update));
router.patch('/auth/deactivate/:id', asyncWrapper(verifyAccessToken), asyncWrapper(isAuthorized), asyncWrapper(deleteUser));
router.patch('/auth/reactivate/:id', asyncWrapper(verifyAccessToken), asyncWrapper(isAuthorized), asyncWrapper(reactivateUser));

export default router;
