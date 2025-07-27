import express from 'express';
import {register , login , refresh , logout , getUserProfile,changeUserPassword, updateUserDetails} from "../controllers/auth.controller.js"
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/logout", authMiddleware , logout)
router.post("/refresh",authMiddleware, refresh)
router.get("/me", authMiddleware , getUserProfile)
router.put("/cup", authMiddleware , changeUserPassword)
router.put("/uud", authMiddleware , updateUserDetails)

export default router