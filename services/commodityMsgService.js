const { Action } = require("../utils/index");
const { validationResult } = require("express-validator");
const { CODE_ERROR, CODE_SUCCESS, CODE_WARNING } = require("../utils/constant");
const { getSystemTime } = require("../utils/time");

const joinParameter = require("../utils/parameter/joinParameters");

const joinEdit = require("../utils/parameter/joinEdit");

// 获取商品留言板信息
const commondityMsgList = (req, res) => {
	const { msg } = req.body;

	const query = `select * from commodity_msg ${joinParameter({
		msg: msg ? msg : null,
	})}`;
	Action(query).then((datas) => {
		Action(`select * from commodity`).then((commoditys) => {
			let arr = [];
			datas.map((data) => {
				let obj = {
					...data,
				};
				commoditys.map((commodity) => {
					if (data.commodity_id == commodity.id) {
						obj["commodity_name"] = commodity.name;
					}
				});
				arr.push(obj);
			});
			res.send(arr);
		});
	});
};

// 发布商品留言信息
const addCommondityMsg = (req, res) => {
	const { commodity_id, user_id, msg } = req.body;

	const query = `insert into commodity_msg values(NULL,'${commodity_id}','${user_id}','${msg}','${getSystemTime()}';`;
	Action(query).then((data) => {
		if (!data || data.affectRows === 0) {
			res.json({
				code: CODE_ERROR,
				msg: "新增商品留言信息失败",
				data: null,
			});
		} else {
			res.json({
				code: CODE_SUCCESS,
				msg: "新增商品留言信息成功",
			});
		}
	});
};

// 编辑商品信息
const editCommondityMsg = (req, res) => {
	const { id, commodity_id, user_id, msg } = req.body;
	let send = {
		commodity_id,
		user_id,
		msg,
	};
	for (let i in send) {
		if ([null, undefined].includes(send[i])) {
			delete send[i];
		}
	}
	console.log(send);
	const query = `update commodity_msg ${joinEdit(send)} where id = '${id}'`;

	console.log(query);
	Action(query).then((datas) => {
		console.log(datas);
		if (datas.affectedRows > 0) {
			res.send({
				code: CODE_SUCCESS,
				msg: "编辑商品评论信息成功",
			});
		} else {
			res.send({
				code: CODE_ERROR,
				msg: "编辑商品评论信息失败",
			});
		}
	});
};

const deleteCommondityMsg = (req, res) => {
	const { id } = req.body;
	const query = `delete from commodity_msg where id = ${id}`;

	Action(query).then((data) => {
		if (!data || data.affectedRows === 0) {
			res.json({
				code: CODE_ERROR,
				msg: "删除商品评论信息失败",
			});
		} else {
			res.json({
				code: CODE_SUCCESS,
				msg: "删除商品评论信息成功",
			});
		}
	});
};

module.exports = {
	commondityMsgList,
	addCommondityMsg,
	editCommondityMsg,
	deleteCommondityMsg,
};
