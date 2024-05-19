const router = require("express").Router();

const transaction = require("../controllers/transactionController");

// API
router.post("/create", transaction.createPayment);
router.post("/create/va", transaction.createPaymentVA);
router.post("/create/card", transaction.createPaymentCard);
router.post("/create/gopay", transaction.createPaymentGopay);
router.get("/status/:orderId", transaction.getTransactionDetail);

module.exports = router;
