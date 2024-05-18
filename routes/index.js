const router = require("express").Router();

/*
    Import other routers here, for example:
    const authRouter = require("./authRouter");
*/
const transactionRouter = require("./transactionRouter");

/*
    Define other routes here, for example:
    router.use("/api/v1/auth", authRouter);
*/

router.use("/api/v1/payment", transactionRouter);

module.exports = router;
