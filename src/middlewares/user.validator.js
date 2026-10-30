import { body, param } from "express-validator";
import { Event } from "../models/event.model.js";
import { Category } from "../models/category.model.js";
import { validateResult } from "./validator.middleware.js";
import { User } from "../models/user.model.js";


export const updateUserValidator = [
  param("id")
    .isMongoId()
    .withMessage("El parámetro 'id' debe ser un ObjectId válido de MongoDB"),

  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("El nombre de usuario debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El nombre de usuario debe ser alfanumérico")
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({
        username: value,
        _id: { $ne: req.params.id },
        deletedAt: null,
      });
      if (existingUser) {
        throw new Error("El nombre de usuario ya se encuentra registrado por otro usuario");
      }
      return true;
    }),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Debe proporcionar un formato de correo electrónico válido")
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const existingEmail = await User.findOne({
        email: value,
        _id: { $ne: req.params.id },
        deletedAt: null,
      });
      if (existingEmail) {
        throw new Error("El correo electrónico ya se encuentra registrado por otro usuario");
      }
      return true;
    }),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol debe ser 'user' o 'admin'"),

  body("profile")
    .optional()
    .isObject()
    .withMessage("El perfil debe ser un objeto"),

  body("profile.firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("profile.lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres"),

  body("profile.birthDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("La fecha de nacimiento debe tener un formato de fecha válido (ISO 8601)")
    .toDate()
    .custom((value) => {
      if (value && new Date(value) > new Date()) {
        throw new Error("La fecha de nacimiento no puede ser una fecha futura");
      }
      return true;
    }),

  body("profile.phone")
    .optional({ values: "falsy" }),

  validateResult,
];