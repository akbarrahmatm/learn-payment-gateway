const ApiError = require("../utils/ApiError");
const uuid = require("uuid");
const midtransClient = require("midtrans-client");
const axios = require("axios");

const createPayment = async (req, res, next) => {
  try {
    const orderId = uuid.v4();
    const totalAmount = 200000;

    const customerDetail = {
      first_name: "John",
      last_name: "Watson",
      email: "test@example.com",
      phone: "+628123456",
      billing_address: {
        first_name: "John",
        last_name: "Watson",
        email: "test@example.com",
        phone: "081 2233 44-55",
        address: "Sudirman",
        city: "Jakarta",
        postal_code: "12190",
        country_code: "IDN",
      },
      shipping_address: {
        first_name: "John",
        last_name: "Watson",
        email: "test@example.com",
        phone: "0 8128-75 7-9338",
        address: "Sudirman",
        city: "Jakarta",
        postal_code: "12190",
        country_code: "IDN",
      },
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
      customer_details: customerDetail,
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

    if (!orderId) {
      return next(new ApiError("orderId is required", 400));
    }

    const options = {
      method: "GET",
      url: `https://api.sandbox.midtrans.com/v2/${orderId}/status`,
      headers: {
        accept: "application/json",
        authorization: `Basic ${req.encodedMidtransServerKey}`,
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

const createPaymentVA = async (req, res, next) => {
  try {
    const { bank } = req.body;
    const orderId = uuid.v4();
    const totalAmount = 200000;

    const allowedBanks = ["bca", "bni", "bri", "mandiri", "permata", "cimb"];

    if (!allowedBanks.includes(bank)) {
      return next(
        new ApiError(
          "Bank transfer should be 'bca, bni, bri, mandiri, permata, cimb'",
          400
        )
      );
    }

    let coreApi = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    let requestBody;

    if (bank === "bca" || bank === "bni" || bank === "bri" || bank === "cimb") {
      requestBody = {
        payment_type: "bank_transfer",
        transaction_details: {
          order_id: orderId,
          gross_amount: totalAmount,
        },
        bank_transfer: {
          bank: bank,
        },
      };
    }

    if (bank === "mandiri") {
      requestBody = {
        payment_type: "echannel",
        transaction_details: {
          order_id: orderId,
          gross_amount: totalAmount,
        },
        echannel: {
          bill_info1: "Payment:",
          bill_info2: "Online purchase",
        },
      };
    }

    if (bank === "permata") {
      requestBody = {
        payment_type: bank,
        transaction_details: {
          order_id: orderId,
          gross_amount: totalAmount,
        },
      };
    }

    const response = await coreApi.charge(requestBody);

    res.status(201).json({
      status: "Success",
      message: "Bank VA is successfully created",
      requestAt: req.requestTime,
      data: response,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  createPayment,
  getTransactionDetail,
  createPaymentVA,
};
