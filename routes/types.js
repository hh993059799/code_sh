// 用户路由模块
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const service = require("../services/typesService");

// 获取所有类型路由
router.post("/types/list", service.getTypeList);

// 添加类型
router.post("/types/add", service.addType);

// 编辑类型
router.post("/types/edit", service.editType);

// 删除用户
router.post("/types/delete", service.deleteType);

module.exports = router;
