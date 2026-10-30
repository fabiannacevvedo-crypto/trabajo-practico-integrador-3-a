import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";
import { updateUserValidator } from "../middlewares/user.validator.js";
import { validateMongoIdParam } from "../middlewares/validator.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

export const userRouter = Router();

//todas las rutas de administracion de usuarios requieren autenticacion y rol de administrador

userRouter.use(authMiddleware, adminMiddleware);

userRouter.get("/", getAllUsers);
userRouter.get("/:id", validateMongoIdParam("id"), getUserById);
userRouter.put("/:id", updateUserValidator, updateUser);
userRouter.delete("/:id", validateMongoIdParam("id"), deleteUser);