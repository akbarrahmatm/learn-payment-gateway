const router = require("express").Router();

const transaction = require("../controllers/transactionController");

// API
router.post("/create", transaction.createPayment);

module.exports = router;
