const uuid = require("uuid");
const midtransClient = require("midtrans-client");

const createPayment = async (req, res, next) => {
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
      },
    });
  }
};

module.exports = {
  createPayment,
};
