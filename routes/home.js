const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const service = require("../services/homeService");

// 获取所有数量
router.post("/home/total/info", service.getAllUser);

// 获取问题类别及其数量
router.post("/home/question/account", service.getTypeNumbers);

// 获取近十二个月销量信息
router.post("/home/commodity/purchase", service.getCommodityPurcharse);

// 获取近十二个月类型销量
router.post("/home/types/purchase", service.seasonAnalysis);

// 咨询量数据
router.post("/home/consult/list", service.consultAnalysis);

// 全量销售数据
router.post("/home/all/salles", service.allSalesTrend);

// 全量咨询
router.post("/home/all/consult", service.allConsuleData);
module.exports = router;
