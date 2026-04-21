import express from "express";
import multer from "multer";
import auth from "../Middleware/auth.js";
import packageController from "../Controller/packageController.js";
import roleBasedAuth from "../Middleware/roleBasedAuth.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  auth,
  roleBasedAuth("GUIDE", "ADMIN"),
  upload.array("images", 5),
  packageController.createPackage,
);

router.get(
  "/package",
  packageController.getAllPackages,
);

router.get(
  "/:id",
  auth,
  roleBasedAuth("TOURIST", "GUIDE"),
  packageController.getPackageById,
);

router.put(
  "/:id",
  auth,
  roleBasedAuth("GUIDE"),
  upload.array("images", 5),
  packageController.updatePackage,
);

router.delete(
  "/:id",
  auth,
  roleBasedAuth("GUIDE", "ADMIN"),
  packageController.deletePackage,
);

export default router;
