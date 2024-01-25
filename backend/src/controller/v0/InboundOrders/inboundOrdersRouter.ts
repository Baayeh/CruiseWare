/* eslint-disable import/prefer-default-export */
import { Router as inboundRouter } from "express";
import inboundOrder from "./inboundOrdersController";
import auth from "../Authentication/authController";

const router: inboundRouter = inboundRouter();

router.post("/", auth.auth, inboundOrder.createInboundOrder);

router.get("/", auth.auth, inboundOrder.readAllInboundOrder);
router.get("/unpaginated", auth.auth, inboundOrder.readAllInboundOrdersUnPaginated);
router.get("/:reference", auth.auth, inboundOrder.readInboundOrder);

router.patch("/:reference", auth.auth, inboundOrder.updateInboundOrder);

router.delete("/:reference", auth.auth, inboundOrder.deleteInboundOrder);

export const InboundRouter: inboundRouter = router;
