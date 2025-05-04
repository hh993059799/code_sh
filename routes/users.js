// 用户路由模块
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const service = require("../services/userService");

// 用户登录
router.post("/login", service.login);

// 用户注册
router.post("/register", service.register);

// 获取所有用户信息
router.post("/user/list", service.userList);

// 删除用户
router.post("/user/delete", service.deleteUser);

// 编辑用户信息
router.post("/user/edit", service.editUserInfo);

module.exports = router;
