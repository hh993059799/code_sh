const { Action } = require("../utils/index");
const { validationResult } = require("express-validator");
const { CODE_ERROR, CODE_SUCCESS, CODE_WARNING } = require("../utils/constant");
const { getSystemTime } = require("../utils/time");

const joinParameter = require("../utils/parameter/joinParameters");

const joinEdit = require("../utils/parameter/joinEdit");

// 获取留言列表
const getMsgList = (req, res) => {
	const { id } = req.body;

	const query = `select * from message where commodity_id = '${id}'`;
	Action(query).then((datas) => {
		Action(`select id,username from users;`).then((users) => {
			datas.map((data) => {
				users.map((user) => {
					if (data.user_id == user.id) {
						data["username"] = user.username;
					}
				});
			});

			res.send(datas);
		});
	});
};

// 新增工单
const addMsgList = (req, res, next) => {
	const { commodity_id, user_id, msg } = req.body;
	const query = `insert into message values(NULL,'${commodity_id}','${user_id}','${msg}','${getSystemTime()}')`;

	Action(query).then((data) => {
		console.log(data);
		if (!data || data.affectRows === 0) {
			res.json({
				code: CODE_ERROR,
				msg: "新增留言失败",
				data: null,
			});
		} else {
			res.json({
				code: CODE_SUCCESS,
				msg: "新增留言成功",
			});
		}
	});
};

module.exports = {
	getMsgList,
	addMsgList,
};
