import { Router as cruiseRouter, Request, Response } from "express";
import { AuthRouter } from "./Authentication/authRouter";
import { BusinessRouter } from "./Business/BusinessRouter";
import { InboundRouter } from "./InboundOrders/inboundOrdersRouter";
import { InventoryRouter } from "./inventory/inventoryRouter";
import { OutboundsRouter } from "./Outbounds/outboundsRouter";
import { ProductRouter } from "./product/productRouter";
import { ReceiverRouter } from "./Receivers/receiverRouter";
import { RegisterRouter } from "./Register/registerRouter";
import { RoleRouter } from "./RolesAndPermissions/roleRouter";
import { SupplierRouter } from "./Suppliers/supplierRouter";
import { UserRouter } from "./User/userRoutes";

const router: cruiseRouter = cruiseRouter();

router.use("/roles", RoleRouter);
router.use("/auth", AuthRouter);
router.use("/register", RegisterRouter);
router.use("/business", BusinessRouter);
router.use("/inventory", InventoryRouter);
router.use("/receiver", ReceiverRouter);
router.use("/supplier", SupplierRouter);
router.use("/product", ProductRouter);
router.use("/outbounds", OutboundsRouter);
router.use("/inbounds", InboundRouter);
router.use("/users", UserRouter);

router.get("/", (req: Request, res: Response) => {
    return res.status(200).send("Hello and welcome to CruiseWare.");
});

export const IndexRouter: cruiseRouter = router;