import {Router} from "express";
import {
    register,
    login,
    getProfile,
    updateProfile,
    logout,
} from "../controllers/auth.controller.js";
import {
    registerValidator,
    loginValidator,
    updateProfileValidator,
} from "../middlewares/auth.validator.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

export const authRouter = Router();

//rutas publicas de autenticacion
authRouter.post("/register",registerValidator,register);
authRouter.post("/login",loginValidator,login);

//rutas protegidas(requieren usuario autenticado mediante cookie JWT)
authRouter.get("/profile",authMiddleware,getProfile);
authRouter.put("/profile",authMiddleware,updateProfileValidator,updateProfile);
authRouter.post("/logout",authMiddleware,logout);

