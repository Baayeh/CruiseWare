/* eslint-disable import/prefer-default-export */
import { Router as userRouter } from "express";
import user from "./userController";
import auth from "../Authentication/authController";

const router: userRouter = userRouter();

router.post("/", auth.auth, user.newUser);

router.get("/", auth.auth, user.getAllUsers);
router.get("/profile", auth.auth, user.getUserProfile);
router.get("/:userId", auth.auth, user.getUser);

router.patch("/update", auth.auth, user.updateProfile);
router.patch("/password/update", auth.auth, user.updatePassword);

router.delete("/:userId", auth.auth, user.deactivateUser);

export const UserRouter: userRouter = router;
