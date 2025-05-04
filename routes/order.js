const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const service = require("../services/orderService");

// 获取所有工单信息
router.post("/order/list", service.getOrderList);

// 添加工单信息
router.post("/order/add", service.addOrder);

// 编辑工单信息
router.post("/order/edit", service.editOrder);

// 删除工单信息
router.post("/order/delete", service.deleteOrder);

// 获取工单聊天详情
router.post("/order/chat/list", service.getChatInfoList);

// 发布聊天信息
router.post("/order/chat/add", service.addChatList);

router.post("/order/chat/finish", service.isFinish);

module.exports = router;
