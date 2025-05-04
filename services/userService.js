const { Action } = require("../utils/index");
const { validationResult } = require("express-validator");
const { CODE_ERROR, CODE_SUCCESS, CODE_WARNING } = require("../utils/constant");
const { getSystemTime } = require("../utils/time");

const joinParameter = require("../utils/parameter/joinParameters");

const joinEdit = require("../utils/parameter/joinEdit");

// 用户登录
const login = (req, res, next) => {
	const err = validationResult(req);
	if (!err.isEmpty()) {
		//如果验证错误，empty不为空
	} else {
		const { username, password } = req.body;
		if (username && password) {
			// 校验用户是否存在
			Action(`select * from users where username = '${username}'`).then(
				(datas) => {
					if (datas.length > 0) {
						// 用户存在，校验密码
						if (datas[0].password == password) {
							// 用户不存在
							res.json({
								code: CODE_SUCCESS,
								msg: "登录成功!",
								data: {
									...datas[0],
									login_date: getSystemTime(),
								},
							});
						} else {
							// 用户不存在
							res.json({
								code: CODE_ERROR,
								msg: "密码错误!",
							});
						}
					} else {
						// 用户不存在
						res.json({
							code: CODE_WARNING,
							msg: "用户不存在!",
						});
					}
				}
			);
		} else {
			// 用户不存在
			res.json({
				code: CODE_WARNING,
				msg: "请输入正常信息!",
			});
		}
	}
};

// 新增用户：不允许同名
const register = (req, res, next) => {
	let { username, password, type, image, remark } = req.body;

	if (type == undefined) {
		type = "3";
		image = "";
		remark = "";
	}

	if (username && password) {
		const query = `select * from users where username = '${username}'`;
		Action(query).then((datas) => {
			let isSameUserName = false;
			datas.map((user) => {
				if (user.username == username) {
					isSameUserName = true;
				}
			});
			if (isSameUserName) {
				res.json({
					code: CODE_ERROR,
					msg: "注册失败,存在同名用户",
					data: null,
				});
			} else {
				const query = `insert into users values(NULL,'${username}','${password}','${type}','${image}','${getSystemTime()}','${remark}')`;
				Action(query).then((data) => {
					if (!data || data.affectRows === 0) {
						res.json({
							code: CODE_ERROR,
							msg: "新增用户失败",
							data: null,
						});
					} else {
						res.json({
							code: CODE_SUCCESS,
							msg: "新增用户成功",
						});
					}
				});
			}
		});
	} else {
		if (type) {
			res.json({
				code: CODE_WARNING,
				msg: "请输入用户名和密码",
			});
		} else {
			res.json({
				code: CODE_WARNING,
				msg: "请输入用户类型",
			});
		}
	}
};

// 删除用户
const deleteUser = (req, res) => {
	let id;
	if (Object.keys(req.body).length > 0) {
		id = req.body.id;
	} else {
		id = req.query.id;
	}

	const query = `delete from users where id = ${id}`;

	Action(query).then((data) => {
		if (!data || data.affectedRows === 0) {
			res.json({
				code: CODE_ERROR,
				msg: "删除用户失败",
			});
		} else {
			res.json({
				code: CODE_SUCCESS,
				msg: "删除用户成功",
			});
		}
	});
};

// 编辑用户信息
const editUserInfo = (req, res) => {
	const { id, username, password, type, image, remark } = req.body;

	const query = `update users ${joinEdit({
		username,
		password,
		type,
		image,
		remark,
	})} where id = '${id}'`;

	Action(query).then((datas) => {
		if (datas.affectedRows > 0) {
			res.send({
				code: CODE_SUCCESS,
				msg: "编辑用户信息成功",
			});
		} else {
			res.send({
				code: CODE_ERROR,
				msg: "编辑用户信息失败",
			});
		}
	});
};

// 获取用户信息
const userList = (req, res) => {
	const { username, type, remark } = req.body;

	const query = `select * from users ${joinParameter({
		username,
		type,
		remark,
	})}`;
	Action(query).then((datas) => {
		res.send(datas);
	});
};

module.exports = {
	login,
	register,
	userList,
	deleteUser,
	editUserInfo,
};
