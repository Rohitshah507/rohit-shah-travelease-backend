import express from "express";
import auth from "../Middleware/auth.js";
import packageController from "../Controller/packageController.js";
import roleBasedAuth from "../Middleware/roleBasedAuth.js";

const router = express.Router();

router.post(
  "/",
  auth,
  roleBasedAuth("GUIDE", "ADMIN"),
  packageController.createPackage,
);

router.get("/package", packageController.getAllPackages);

router.get("/:id", packageController.getPackageById);

router.put("/:id", roleBasedAuth("GUIDE"), packageController.updatePackage);

router.delete("/:id", roleBasedAuth("GUIDE"), packageController.deletePackage);

export default router;
