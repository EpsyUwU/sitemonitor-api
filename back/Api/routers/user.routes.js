import { Router } from 'express';
import { userController } from '../controllers/user.controller.js'

const router = Router();

router.post('/create_user' , (req, res) => userController.create_user(req, res));
router.delete("/delete_user/:IdUsuario", (req, res) => userController.delete_user(req, res));
router.get('/all_User', (req, res) => userController.all_User(req,res)); 
router.post('/login', (req, res) => userController.login(req,res)); 
router.get('/user_By_IdUser/:IdUsuario', (req, res) => userController.user_By_IdUser(req,res)); 

export default router;