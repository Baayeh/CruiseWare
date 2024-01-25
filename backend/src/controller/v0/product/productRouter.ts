/* eslint-disable import/prefer-default-export */
import { Router as productRouter } from "express";
import product from "./productController";
import auth from "../Authentication/authController";
import { parser } from "../../../utils/upload";

const router: productRouter = productRouter();

router.post("/", auth.auth, parser.single("photo"), product.newProduct);

router.get("/", auth.auth, product.readAllProduct);
router.get("/unpaginated", auth.auth, product.readAllProductUnPaginated);
router.get("/deleted", auth.auth, product.deletedProduct);
router.get("/:productId", auth.auth, product.readProduct);

router.patch("/:productId", parser.single("photo"), auth.auth, product.updateProduct);

router.delete("/:productId", auth.auth, product.deleteProduct);

export const ProductRouter: productRouter = router;
