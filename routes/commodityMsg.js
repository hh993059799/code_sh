// 商品管理模块
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const service = require("../services/commodityMsgService");

// 商品评论管理
router.post("/commodity/msg/list", service.commondityMsgList);
router.post("/commodity/msg/add", service.addCommondityMsg);
router.post("/commodity/msg/edit", service.editCommondityMsg);
router.post("/commodity/msg/delete", service.deleteCommondityMsg);

module.exports = router;
