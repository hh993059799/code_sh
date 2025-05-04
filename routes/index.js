// 初始化路由信息，自定义全局异常处理
const express = require("express");

const router = express.Router(); // 注册路由
const userRouter = require("./users");
const typesRouter = require("./types");
const orderRouter = require("./order");
const commodityRouter = require("./commodity");
const commodityMsgRouter = require("./commodityMsg");
const purchaseRouter = require("./purchase");
const homeRouter = require("./home");
const msgRouter = require("./message");

// 注入用户模块
router.use(userRouter);

// 注入类型管理
router.use(typesRouter);

// 注入商品模块
router.use(commodityRouter);

// 注入商品评论模块
router.use(commodityMsgRouter);

// 注入订单模块
router.use(purchaseRouter);

// 注入工单
router.use(orderRouter);

// 注入home
router.use(homeRouter);

// 注入留言
router.use(msgRouter);

module.exports = router;
