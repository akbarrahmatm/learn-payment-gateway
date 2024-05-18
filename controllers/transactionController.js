const ApiError = require("../utils/ApiError");
const uuid = require("uuid");
const midtransClient = require("midtrans-client");
const axios = require("axios");

const createPayment = async (req, res, next) => {
  try {
    const orderId = uuid.v4();
    const totalAmount = 200000;

    const customerDetail = {
      first_name: "Akbar",
      last_name: "Rahmat Mulyatama",
      email: "akbarrahmatmulyatama@gmail.com",
      phone: "087883812700",
    };

    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      credit_card: {
        secure: true,
      },
      customers_details: customerDetail,
    };

    const transaction = await snap.createTransaction(parameter);

    if (transaction) {
      res.status(200).json({
        status: "Success",
        message: "Snap payment successfully created",
        requestAt: req.requestTime,
        data: {
          transaction,
          transaction_details: parameter,
        },
      });
    }
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const getTransactionDetail = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    console.log(orderId);

    if (!orderId) {
      return next(new ApiError("orderId is required", 400));
    }

    const options = {
      method: "GET",
      url: `https://api.sandbox.midtrans.com/v2/${orderId}/status`,
      headers: {
        accept: "application/json",
        authorization:
          "Basic U0ItTWlkLXNlcnZlci15X3ZoTVN6Z3J0SW9rckNoRmxaRzRySlA6",
      },
    };

    const response = await axios.request(options);

    res.status(200).json({
      status: "Success",
      message: "Transaction status retrieved",
      requestAt: req.requestTime,
      data: {
        transaction_status: response.data,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  createPayment,
  getTransactionDetail,
};
