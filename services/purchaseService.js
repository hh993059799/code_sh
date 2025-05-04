const { Action } = require("../utils/index");
const { validationResult } = require("express-validator");
const { CODE_ERROR, CODE_SUCCESS, CODE_WARNING } = require("../utils/constant");
const { getSystemTime } = require("../utils/time");

const joinParameter = require("../utils/parameter/joinParameters");

const joinEdit = require("../utils/parameter/joinEdit");

// 获取订单
const purchaseList = (req, res) => {
	const { commodity_id } = req.body;

	const query = `select * from purchase ${joinParameter({
		commodity_id: commodity_id ? commodity_id : null,
	})}`;
	Action(query).then((datas) => {
		Action(`select * from users`).then((users) => {
			Action(`select * from commodity`).then((commodities) => {
				let arr = [];
				datas.map((data) => {
					let obj = {
						...data,
					};
					users.map((user) => {
						if (data.user_id == user.id) {
							obj["username"] = user.username;
						}
						if (data.creator_id == user.id) {
							obj["creatorName"] = user.username;
						}
					});
					commodities.map((commoditie) => {
						if (data.commodity_id == commoditie.id) {
							obj["commoditieName"] = commoditie.name;
						}
					});
					arr.push(obj);
				});
				res.send(arr);
			});
		});
	});
};

// 创建订单
const addPurchase = (req, res) => {
	const { user_id, commodity_id, price, account, creator_id, remark } =
		req.body;
	console.log(req.body);
	const query = `insert into purchase values(NULL,'${user_id}','${commodity_id}','${account}','${
		Number(account) * Number(price)
	}','${creator_id}','${getSystemTime()}','${remark ? remark : ""}')`;

	Action(`select * from commodity where id = '${commodity_id}'`).then(
		(commodity) => {
			console.log(commodity);
			if (commodity.length > 0) {
				if (account > commodity[0].account) {
					res.json({
						code: CODE_ERROR,
						msg: "新增订单失败,数量超过该批次库存",
						data: null,
					});
				} else {
					Action(query).then((data) => {
						if (!data || data.affectRows === 0) {
							res.json({
								code: CODE_ERROR,
								msg: "新增订单失败",
								data: null,
							});
						} else {
							Action(
								`update commodity set account = '${
									Number(commodity[0].account) - Number(account)
								}' where id = ${commodity[0].id}`
							).then((cl) => {
								if (!cl || cl.affectRows === 0) {
									res.json({
										code: CODE_ERROR,
										msg: "新增订单成功，修改状态失败",
										data: null,
									});
								} else {
									res.json({
										code: CODE_SUCCESS,
										msg: "新增订单成功",
										data: null,
									});
								}
							});
						}
					});
				}
			}
		}
	);
};

// 编辑订单信息
const editPurchase = (req, res) => {
	const { id, account, remark, commodity_id } = req.body;
	let send = {
		account,
		remark,
	};

	Action(`select * from commodity where id = '${commodity_id}'`).then(
		(commoditie) => {
			console.log(commoditie);
			if (commoditie.length > 0) {
				let price = commoditie[0].price;
				send["total_price"] = Number(account) * Number(price);

				for (let i in send) {
					if ([null, undefined, "price"].includes(send[i])) {
						delete send[i];
					}
				}
				console.log(send);
				const query = `update purchase ${joinEdit(
					send
				)} where id = '${id}'`;
				if (Number(commoditie[0].account) > Number(account)) {
					Action(query).then((datas) => {
						console.log(datas);
						if (datas.affectedRows > 0) {
							Action(
								`update commodity set account = '${
									Number(commoditie[0].account) - Number(account)
								}' where id = ${commoditie[0].id}`
							).then((cl) => {
								if (!cl || cl.affectRows === 0) {
									res.json({
										code: CODE_ERROR,
										msg: "编辑订单成功，修改状态失败",
										data: null,
									});
								} else {
									res.json({
										code: CODE_SUCCESS,
										msg: "编辑订单信息成功",
										data: null,
									});
								}
							});
						} else {
							res.send({
								code: CODE_ERROR,
								msg: "编辑订单信息失败",
							});
						}
					});
				} else {
					Action(query).then((datas) => {
						console.log(datas);
						if (datas.affectedRows > 0) {
							Action(
								`update commodity set account = '${
									Number(account)
								}' where id = ${commoditie[0].id}`
							).then((cl) => {
								if (!cl || cl.affectRows === 0) {
									res.json({
										code: CODE_ERROR,
										msg: "编辑订单成功，修改状态失败",
										data: null,
									});
								} else {
									res.json({
										code: CODE_SUCCESS,
										msg: "编辑订单信息成功",
										data: null,
									});
								}
							});
						} else {
							res.send({
								code: CODE_ERROR,
								msg: "编辑订单信息失败",
							});
						}
					});
				}
			}
		}
	);
};

const deletePurchase = (req, res) => {
	const { id } = req.body;
	const query = `delete from purchase where id = ${id}`;

	Action(query).then((data) => {
		if (!data || data.affectedRows === 0) {
			res.json({
				code: CODE_ERROR,
				msg: "删除订单失败",
			});
		} else {
			res.json({
				code: CODE_SUCCESS,
				msg: "删除订单成功",
			});
		}
	});
};

module.exports = {
	purchaseList,
	addPurchase,
	editPurchase,
	deletePurchase,
};
