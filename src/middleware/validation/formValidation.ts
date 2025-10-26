// src/middleware/validation/formValidators.ts
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const formValidator = [
  body("fio")
    .notEmpty()
    .withMessage("ФИО обязательно")
    .isLength({ min: 2, max: 100 })
    .trim(),
  body("phone")
    .notEmpty()
    .withMessage("Телефон обязателен")
    .isLength({ min: 5, max: 20 })
    .trim(),
  body("address")
    .notEmpty()
    .withMessage("Адрес обязателен")
    .isLength({ max: 200 })
    .trim(),
  body("house")
    .notEmpty()
    .withMessage("Дом обязателен")
    .isLength({ max: 50 })
    .trim(),
  body("agreement").notEmpty().withMessage("Соглашение обязательно"),
  body("email").optional().isEmail().normalizeEmail(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];
