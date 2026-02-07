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

router.get("/package", auth, roleBasedAuth("TOURIST"), packageController.getAllPackages);

router.get("/:id", auth, roleBasedAuth("TOURIST"),packageController.getPackageById);

router.put("/:id", auth, roleBasedAuth("GUIDE"), packageController.updatePackage);

router.delete("/:id", auth, roleBasedAuth("GUIDE"), packageController.deletePackage);

export default router;
