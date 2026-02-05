import TourPackage from "../Model/TourPackages.js";
import uploadFile from "../utils/file.js";

const createProduct = async (data, files, createdBy) => {
  if (!data) {
    throw { statusCode: 400, message: "Package data is required" };
  }
  const uploadedResults = await uploadFile(files);

  const imageUrls = uploadedResults.map((file) => file.secure_url);
  const newPackage = await TourPackage.create({
    ...data,
    imageUrls,
    guideId: createdBy,
  });
  return newPackage;
};

const getAllPackages = async () => {
  const packages = await TourPackage.find();
  return packages;
};

const getPackageById = async (id) => {
  const packageId = await TourPackage.findById(id);
  return packageId;
};

const updatePackage = async (id, data) => {
  const updatedPackage = TourPackage.findByIdAndUpdate(id, data, { new: true });
  return updatedPackage;
};

const deletePackage = async (id) => {
  TourPackage.findByIdAndDelete(id);
};

export default {
  createProduct,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
