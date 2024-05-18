const router = require("express").Router();

const transaction = require("../controllers/transactionController");

// API
router.post("/create", transaction.createPayment);
router.get("/status/:orderId", transaction.getTransactionDetail);

module.exports = router;
