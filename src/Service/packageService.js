import { PACKAGE_DESCRIPTION_PROMPT } from "../constants/prompt.js";
import TourPackage from "../Model/TourPackages.js";
import uploadFile from "../utils/file.js";
import promptGemini from "../utils/gemini.js";

const createProduct = async (data, files, createdBy) => {
  if (!data) {
    throw { statusCode: 400, message: "Package data is not found" };
  }
  const uploadedResults = await uploadFile(files);
  const promptMessage = PACKAGE_DESCRIPTION_PROMPT.replace("%s", data.title)
    .replace("%s", data.destination)
    .replace("%s", data.duration)
    .replace("%s", data.price);

  const aiDescription = await promptGemini(promptMessage);

  const imageUrls = uploadedResults.map((file) => file.secure_url);
  const newPackage = await TourPackage.create({
    ...data,
    imageUrls,
    description: data.description ?? aiDescription,
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
  return TourPackage.findByIdAndDelete(id);
};

export default {
  createProduct,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
