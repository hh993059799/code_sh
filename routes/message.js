const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const service = require("../services/messageService");

// 获取当前商品留言
router.post("/message/list", service.getMsgList);

// 发布留言
router.post("/message/add", service.addMsgList);

module.exports = router;
