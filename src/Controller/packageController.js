import packageService from "../Service/packageService.js";

const createPackage = async (req, res) => {
  const files = req.files;
  const data = req.body;
  try {
    if (
      !data.title ||
      !data.price ||
      !data.duration ||
      !data.destination ||
      !data.startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All data are required",
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All data are required",
      });
    }

    if (data.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price should be greater than zero",
      });
    }
    if (data.duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration should be greater than zero",
      });
    }

    const newPackage = await packageService.createProduct(data, files);
    return res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: newPackage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const getPackages = await packageService.getAllPackages();
    res.status(200).json({
      success: true,
      message: "Packages fetched successfully",
      getPackages,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Invalid Server Error",
      error: error.message,
    });
  }
};

const getPackageById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Package ID is required",
      });
    }

    const packageId = await packageService.getPackageById(id);
    res.status(200).json({
      success: true,
      message: "Package from id fetched successfully",
      packageId,
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

const updatePackage = async (req, res) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Package ID is required",
      });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided for update",
      });
    }

    const data = await packageService.updatePackage(id, req.body);
    res.status(200).json({
      success: true,
      message: "Updated Successfully",
      data,
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

const deletePackage = async (req, res) => {
  const id = req.params.id;

  try {
    await packageService.deletePackage(id);
    res.status(200).json({
      success: true,
      message: `Deleted package with id: ${id} successfully`,
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

export default {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
