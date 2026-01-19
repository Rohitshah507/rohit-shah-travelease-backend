import TourPackage from "../Model/TourPackages.js";

const createProduct = async (data) => {
  if (!data) {
    throw { statusCode: 400, message: "Package data is required" };
  }
  const newPackage = await TourPackage.create(data);
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
  const deletedPackage = TourPackage.findByIdAndDelete(id);
};

export default { createProduct, getAllPackages, getPackageById, updatePackage, deletePackage };
