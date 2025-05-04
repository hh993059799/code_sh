const { Action } = require("../utils/index");
const { validationResult } = require("express-validator");
const { CODE_ERROR, CODE_SUCCESS, CODE_WARNING } = require("../utils/constant");
const { getSystemTime } = require("../utils/time");

// 获取所有类型数据
const getTypeList = (req, res) => {
	const { label } = req.body;
	let query = ``;
	if (label) {
		query = `select * from types where label like '%${label}%'`;
	} else {
		query = `select * from types`;
	}

	Action(query).then((datas) => {
		res.send(datas);
	});
};

// 新增类型
const addType = (req, res) => {
	const { label } = req.body;
	const query = `insert into types values(NULL,'${label}')`;
	Action(query).then((data) => {
		if (!data || data.affectedRows === 0) {
			res.json({
				code: CODE_ERROR,
				msg: "新增类型失败",
			});
		} else {
			res.json({
				code: CODE_SUCCESS,
				msg: "新增类型成功",
			});
		}
	});
};

// 编辑类型
const editType = (req, res) => {
	const { label, id } = req.body;
	Action(`update types set label='${label}'  where id = '${id}' `).then(
		(datas) => {
			if (datas.affectedRows > 0) {
				res.send({
					code: CODE_SUCCESS,
					msg: "编辑类型成功",
				});
			} else {
				res.send({
					code: CODE_ERROR,
					msg: "编辑类型失败",
				});
			}
		}
	);
};

// 删除类型
const deleteType = (req, res) => {
	const { id } = req.body;
	Action(`delete from types where id = '${id}'`).then((data) => {
		if (!data || data.affectedRows === 0) {
			res.json({
				code: CODE_ERROR,
				msg: "删除类型失败",
			});
		} else {
			res.json({
				code: CODE_SUCCESS,
				msg: "删除类型成功",
			});
		}
	});
};

module.exports = {
	getTypeList,
	addType,
	editType,
	deleteType,
};
