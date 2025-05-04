// 商品管理模块
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const service = require("../services/commodityService");

// 商品管理
router.post("/commodity/list", service.commondityList);
router.post("/commodity/add", service.addCommondity);
router.post("/commodity/edit", service.editCommondity);
router.post("/commodity/delete", service.deleteCommondity);

module.exports = router;
