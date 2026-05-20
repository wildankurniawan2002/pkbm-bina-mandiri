import { Router } from 'express';
import { PeriodeUjianController } from '../controllers/UjianAdministrasiController.js';
import { verifyToken, checkRole, ROLES } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', checkRole(ROLES.ADMIN, ROLES.SUPER_ADMIN), PeriodeUjianController.getAll);
router.get('/:id', checkRole(ROLES.ADMIN, ROLES.SUPER_ADMIN), PeriodeUjianController.getById);
router.post('/', checkRole(ROLES.SUPER_ADMIN), PeriodeUjianController.create);
router.put('/:id', checkRole(ROLES.SUPER_ADMIN), PeriodeUjianController.update);
router.patch('/:id/status', checkRole(ROLES.SUPER_ADMIN), PeriodeUjianController.updateStatus);

export default router;
