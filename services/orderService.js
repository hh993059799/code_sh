const { Action } = require("../utils/index");
const { validationResult } = require("express-validator");
const { CODE_ERROR, CODE_SUCCESS, CODE_WARNING } = require("../utils/constant");
const { getSystemTime } = require("../utils/time");

const joinParameter = require("../utils/parameter/joinParameters");

const joinEdit = require("../utils/parameter/joinEdit");

// 获取工单列表
const getOrderList = (req, res) => {
	const { title, status } = req.body;

	const query = `select * from orders ${joinParameter({
		title,
		status
	})}`;
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
const addOrder = (req, res, next) => {
	const { title, user_id, info } = req.body;
	const query = `insert into orders values(NULL,'${title}','${user_id}','${getSystemTime()}','0')`;

	Action(query).then((data) => {
		console.log(data);
		if (!data || data.affectRows === 0) {
			res.json({
				code: CODE_ERROR,
				msg: "新增工单失败",
				data: null,
			});
		} else {
			res.json({
				code: CODE_SUCCESS,
				msg: "新增工单成功",
			});

			Action(
				`insert into chat_list values(NULL,'${info}','${
					data.insertId
				}','${user_id}','${getSystemTime()}')`
			);
		}
	});
};

// 编辑工单信息
const editOrder = (req, res) => {
	const { id, title } = req.body;

	const query = `update orders ${joinEdit({
		title,
	})} where id = '${id}'`;

	Action(query).then((datas) => {
		if (datas.affectedRows > 0) {
			res.send({
				code: CODE_SUCCESS,
				msg: "编辑工单信息成功",
			});
		} else {
			res.send({
				code: CODE_ERROR,
				msg: "编辑工单信息失败",
			});
		}
	});
};

// 删除工单信息
const deleteOrder = (req, res) => {
	const { id } = req.body;

	const query = `delete from orders where id = ${id}`;

	Action(query).then((data) => {
		if (!data || data.affectedRows === 0) {
			res.json({
				code: CODE_ERROR,
				msg: "删除工单信息失败",
			});
		} else {
			res.json({
				code: CODE_SUCCESS,
				msg: "删除工单信息成功",
			});
		}
	});
};

// 获取聊天内容
const getChatInfoList = (req, res) => {
	const { order_id } = req.body;
	Action(`select * from chat_list where order_id = '${order_id}'`).then(
		(lists) => {
			Action(`select id,username,type from users`).then((users) => {
				lists.map((list) => {
					users.map((user) => {
						if (list.user_id == user.id) {
							list["username"] = user.username;
							list["userType"] = user.type;
						}
					});
				});

				res.send(lists);
			});
		}
	);
};

const addChatList = (req, res) => {
	const { info, order_id, user_id, isReplica } = req.body;
	Action(
		`insert into chat_list values(NULL,'${info}','${order_id}','${user_id}','${getSystemTime()}')`
	).then((datas) => {
		if (isReplica) {
			Action(`update orders set status = '1' where id = '${order_id}';`);
		}
		res.send({});
	});
};

const isFinish = (req, res) => {
	const { order_id } = req.body;
	Action(`update orders set status = '2' where id = '${order_id}';`).then(
		(datas) => {
			res.send({});
		}
	);
};

module.exports = {
	getOrderList,
	addOrder,
	editOrder,
	deleteOrder,
	getChatInfoList,
	addChatList,
	isFinish,
};
