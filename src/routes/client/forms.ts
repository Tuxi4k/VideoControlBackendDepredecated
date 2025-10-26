import { Router } from "express";
import { FormController } from "../../client/form/formController";
// import { formValidator } from "../../middleware/validation/formValidator";

const router = Router();
const formController = new FormController();

//twice placed formValidator,
router.post("/send-form", formController.submitForm);

export default router;
