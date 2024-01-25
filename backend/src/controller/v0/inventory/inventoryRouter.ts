/* eslint-disable import/prefer-default-export */
import { Router as inventoryRouter } from "express";
import inventory from "./inventoryController";
import auth from "../Authentication/authController";

const router: inventoryRouter = inventoryRouter();

router.post("/", auth.auth, inventory.newInventory);

router.get("/", auth.auth, inventory.readAllInventory);
router.get("/unpaginated", auth.auth, inventory.readAllInventoryUnPaginated);
router.get("/deleted", auth.auth, inventory.deletedInventories);
router.get("/:inventoryId", auth.auth, inventory.readInventory);

router.patch("/:inventoryId", auth.auth, inventory.updateInventory);

router.delete("/:inventoryId", auth.auth, inventory.deleteInventory);

export const InventoryRouter: inventoryRouter = router;
