// 订单管理模块
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const service = require("../services/purchaseService");

// 订单管理
router.post("/purchase/list", service.purchaseList);
router.post("/purchase/add", service.addPurchase);
router.post("/purchase/edit", service.editPurchase);
router.post("/purchase/delete", service.deletePurchase);

module.exports = router;
