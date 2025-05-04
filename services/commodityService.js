const { Action } = require("../utils/index");
const { validationResult } = require("express-validator");
const { CODE_ERROR, CODE_SUCCESS, CODE_WARNING } = require("../utils/constant");
const { getSystemTime } = require("../utils/time");

const joinParameter = require("../utils/parameter/joinParameters");

const joinEdit = require("../utils/parameter/joinEdit");

// 获取商品信息
const commondityList = (req, res) => {
	const { type_id, name, code, status } = req.body;

	const query = `select * from commodity ${joinParameter({
		type_id: type_id ? type_id : null,
		name: name ? name : null,
		code: code ? code : null,
		status: status ? status : null,
	})}`;
	Action(query).then((datas) => {
		Action(`select * from types`).then((types) => {
			let arr = [];
			datas.map((data) => {
				let obj = {
					...data,
				};
				types.map((type) => {
					if (data.type_id == type.id) {
						obj["type_name"] = type.label;
					}
				});
				arr.push(obj);
			});
			res.send(arr);
		});
	});
};

// 上传商品信息
const addCommondity = (req, res) => {
	const { name, type_id, account, price, code, status } = req.body;

	const query = `insert into commodity values(NULL,'${name}','${type_id}','${account}','${price}','${code}','${getSystemTime()}','${status}')`;
	Action(query).then((data) => {
		if (!data || data.affectRows === 0) {
			res.json({
				code: CODE_ERROR,
				msg: "新增商品信息失败",
				data: null,
			});
		} else {
			res.json({
				code: CODE_SUCCESS,
				msg: "新增商品信息成功",
			});
		}
	});
};

// 编辑商品信息
const editCommondity = (req, res) => {
	const { id, name, account, type_id, price, code, status } = req.body;
	let send = {
		name,
		type_id,
		account,
		price,
		code,
		status,
	};
	for (let i in send) {
		if ([null, undefined].includes(send[i])) {
			delete send[i];
		}
	}
	console.log(send);
	const query = `update commodity ${joinEdit(send)} where id = '${id}'`;

	console.log(query);
	Action(query).then((datas) => {
		console.log(datas);
		if (datas.affectedRows > 0) {
			res.send({
				code: CODE_SUCCESS,
				msg: "编辑商品信息成功",
			});
		} else {
			res.send({
				code: CODE_ERROR,
				msg: "编辑商品信息失败",
			});
		}
	});
};

const deleteCommondity = (req, res) => {
	const { id } = req.body;
	const query = `delete from commodity where id = ${id}`;

	Action(query).then((data) => {
		if (!data || data.affectedRows === 0) {
			res.json({
				code: CODE_ERROR,
				msg: "删除商品信息失败",
			});
		} else {
			res.json({
				code: CODE_SUCCESS,
				msg: "删除商品信息成功",
			});
		}
	});
};

module.exports = {
	commondityList,
	addCommondity,
	editCommondity,
	deleteCommondity,
};
