import { Router } from "express";
import { subscriptionController } from "./subcription.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.post(
    "/checkout",
    auth(Role.USER, Role.ADMIN, Role.AUTHOR),
    subscriptionController.createCheckoutSession
);

export const subscriptionRouter = router;