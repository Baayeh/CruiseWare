import { Router } from "express";
import auth from "../Authentication/authController";
import business from "./BusinessController";

const router: Router = Router();


router.patch("/", auth.auth, business.updateBusinessData);


router.get("/", auth.auth, business.getBusinessData);


router.post("/hours", auth.auth, business.createHours);


router.post("/socials", auth.auth, business.createSocials);


router.post("/locations", auth.auth, business.createLocations);

export const BusinessRouter: Router = router;