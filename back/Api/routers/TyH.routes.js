import { Router } from 'express';
import TyHController from '../controllers/TyH.controller.js'

const router = Router();

router.post('/nuevoRegistro', (req, res) => TyHController.nuevoRegistroTyH(req,res));
router.post('/all_registros', (req, res) => TyHController.all_RegsitroTyH(req,res));

export default router;