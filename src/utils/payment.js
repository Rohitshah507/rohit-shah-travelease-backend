import config from "../Config/config.js";
import axios from "axios";

const payViaKhalti = async (data) => {
  if (!data) throw new Error("Payment data is required");

  if (!data.amount || data.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (!data.purchase_order_id || !data.purchase_order_name) {
    throw new Error("purchase_order_id and purchase_order_name are required");
  }

  const body = {
    return_url: config.khalti.return_url,
    website_url: config.frontend_url,
    amount: data.amount,
    purchase_order_id: data.purchase_order_id,
    purchase_order_name: data.purchase_order_name,
    customer_info: {
      name: data.customer_info?.name || "",
      email: data.customer_info?.email || "",
      phone: data.customer_info?.phone || "",
    },
  };

  try {
    const response = await axios.post(
      `${config.khalti.api_url}/epayment/initiate/`,
      body,
      {
        headers: {
          Authorization: `Key ${config.khalti.api_key}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log("KHALTI FULL ERROR:", error.response?.data);
    console.log("KHALTI KEY SENT:", `Key ${config.khalti.api_key}`);
    throw {
      statusCode: 400,
      message: error.response?.data?.detail || "Khalti initiation failed",
    };
  }
};

export default { payViaKhalti };
