import { Router } from "express";
import auth from "../Authentication/authController";
import permissionController from "./RolesAndPermissionsControllers/permissionController";
import roleController from "./RolesAndPermissionsControllers/roleController";

const router: Router = Router();


router.get("/permissions", auth.auth, permissionController.getAllPermissions);



router.get("/", auth.auth, roleController.getAllRoles);



router.get("/:roleName/", auth.auth, roleController.getRole);



router.post("/", auth.auth, roleController.createRole);



router.delete("/:roleName", auth.auth, roleController.deleteRole);



router.put("/:roleName", auth.auth, roleController.updateRole);


router.post("/:roleName/", auth.auth, roleController.addRolePermissions);


router.get("/:roleName/permissions", auth.auth, roleController.getRolePermissions);


router.delete("/:roleName/:permissionName", auth.auth, roleController.removeRolePermission);




export const RoleRouter: Router = router;