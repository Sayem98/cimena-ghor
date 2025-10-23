import { Router } from "express";
import * as authController from "./controller";

const router: Router = Router();

router.post("/register", authController.register);

export { router };
