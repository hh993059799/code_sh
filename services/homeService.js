const { Action } = require("../utils/index");
const { validationResult } = require("express-validator");
const { CODE_ERROR, CODE_SUCCESS, CODE_WARNING } = require("../utils/constant");
const { getSystemTime } = require("../utils/time");

const joinParameter = require("../utils/parameter/joinParameters");

// 获取系统总人数
const getAllUser = (req, res) => {
	const query = `select * from users`;
	Action(query).then((datas) => {
		Action(`select * from types`).then((types) => {
			res.send({
				user_total: datas.length,
				kown_total: types.length,
			});
		});
	});
};

// 获取药品类别及其数量
const getTypeNumbers = (req, res) => {
	Action(`select * from purchase`).then((purchases) => {
		Action(`select * from commodity`).then((commodities) => {
			Action(`select * from types`).then((types) => {
				let send = [];
				purchases.map((purchase) => {
					let total = 0;
					let name = "";
					let type = "";
					commodities.map((commodity) => {
						if (purchase.commodity_id == commodity.id) {
							total += 1;
							name = commodity.name;
							type = commodity.type_id;
						}
					});
					send.push({
						label: name,
						value: total,
						type: type,
					});
				});

				let result = [];
				send.map((el) => {
					if (
						result.filter((dd) => {
							return dd.label == el.label;
						}).length == 0
					) {
						const arr = send.filter((obj) => {
							return obj.type == el.type;
						});
						let to = 0;
						arr.map((cl) => {
							to += cl.value;
						});
						if (arr.length > 0) {
							result.push({
								...el,
								value: to,
							});
						}
					}
				});
				res.send(result);
			});
		});
	});
};

// 获取药品近十二个月销量
const getCommodityPurcharse = (req, res) => {
	const sql = `SELECT 
    p.commodity_id AS id,
    c.name AS name,
    DATE_FORMAT(p.create_time, '%Y-%m') AS month,
    SUM(p.account) AS total_account
	FROM purchase AS p
	LEFT JOIN commodity AS c ON p.commodity_id = c.id
	WHERE p.create_time >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
	GROUP BY p.commodity_id, DATE_FORMAT(p.create_time, '%Y-%m')
	ORDER BY p.commodity_id, month;`;
	Action(sql).then((datas) => {
		const month = generateLastTwelveMonths();
		// 按照"id"进行排序
		datas.sort((a, b) => a.id - b.id);
		// 创建一个对象，用于存储按照'id'分组后的数据
		const groupedData = {};
		// 按照'id'进行分组并填充数据
		datas.forEach((item) => {
			if (!groupedData[item.id]) {
				groupedData[item.id] = {
					id: item.id,
					name: item.name,
					data: Array(12).fill(0), // 初始化一个包含12个元素，值为0的数组
				};
			}

			const monthIndex = month.indexOf(item.month); // 获取月份在数组中的索引
			groupedData[item.id].data[monthIndex] = item.total_account; // 将total_account填充到对应月份位置
		});

		// 将结果转换为数组形式
		const result = Object.values(groupedData);
		console.log(result);
		res.send(result);
	});
};

// 季节分析
const seasonAnalysis = (req, res) => {
	const month = generateLastTwelveMonths();
	const sql = `SELECT
    t.id AS id,
    t.label AS name,
	DATE_FORMAT(s.create_time, '%Y-%m') AS month,
    SUM(s.account) AS total_sales
	FROM purchase s
	JOIN commodity c ON s.commodity_id = c.id
	JOIN types t ON c.type_id = t.id
	WHERE s.create_time >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
	GROUP BY t.id, t.label, month
	ORDER BY t.id,month;`;

	Action(sql).then((datas) => {
		// 按照"id"进行排序
		datas.sort((a, b) => a.id - b.id);
		// 创建一个对象，用于存储按照'id'分组后的数据
		const groupedData = {};
		// 按照'id'进行分组并填充数据
		datas.forEach((item) => {
			if (!groupedData[item.id]) {
				groupedData[item.id] = {
					id: item.id,
					name: item.name,
					data: Array(12).fill(0), // 初始化一个包含12个元素，值为0的数组
				};
			}
			const monthIndex = month.indexOf(item.month); // 获取月份在数组中的索引
			groupedData[item.id].data[monthIndex] = item.total_sales; // 将total_account填充到对应月份位置
		});

		// 将结果转换为数组形式
		const result = Object.values(groupedData);
		res.send(result);
	});
};

// 咨询量
const consultAnalysis = (req, res) => {
	const month = generateLastTwelveMonths();
	const sql = `SELECT
    u.type,
    DATE_FORMAT(c.create_time, '%Y-%m') AS month,
    COUNT(c.id) AS num_consultations
	FROM users u
	JOIN chat_list c ON u.id = c.user_id
	WHERE u.type IN (2, 3)
	AND c.create_time >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
	GROUP BY u.type, month
	ORDER BY u.type, month;`;

	Action(sql).then((datas) => {
		const arr = [
			{
				id: 2,
				name: "医生",
				data: Array(12).fill(0),
			},
			{
				id: 3,
				name: "患者",
				data: Array(12).fill(0),
			},
		];

		datas.map((data) => {
			if (data.type == 2) {
				const monthIndex = month.indexOf(data.month); // 获取月份在数组中的索引
				arr[0].data[monthIndex] = data.num_consultations;
			}
			if (data.type == 3) {
				const monthIndex = month.indexOf(data.month); // 获取月份在数组中的索引
				arr[1].data[monthIndex] = data.num_consultations;
			}
		});
		res.send(arr);
	});
};

// 全量销售趋势
const allSalesTrend = (req, res) => {
	const sql = `SELECT 
    p.commodity_id AS id,
    c.name AS name,
    DATE_FORMAT(p.create_time, '%Y-%m') AS month,
    SUM(p.account) AS total_account
	FROM purchase AS p
	LEFT JOIN commodity AS c ON p.commodity_id = c.id
	GROUP BY p.commodity_id, DATE_FORMAT(p.create_time, '%Y-%m')
	ORDER BY p.commodity_id, month;`;
	Action(sql).then((datas) => {
		const month = generateLastTwelveMonths();
		// 按照"id"进行排序
		datas.sort((a, b) => a.id - b.id);
		// 创建一个对象，用于存储按照'id'分组后的数据
		const groupedData = {};
		// 按照'id'进行分组并填充数据
		datas.forEach((item) => {
			if (!groupedData[item.id]) {
				groupedData[item.id] = {
					id: item.id,
					name: item.name,
					data: Array(12).fill(0), // 初始化一个包含12个元素，值为0的数组
				};
			}

			const monthIndex = month.indexOf(item.month); // 获取月份在数组中的索引
			groupedData[item.id].data[monthIndex] = item.total_account; // 将total_account填充到对应月份位置
		});

		// 将结果转换为数组形式
		const result = Object.values(groupedData);
		console.log(result);
		res.send(result);
	});
};

// 全量咨询数据
const allConsuleData = (req,res)=>{
	const month = generateLastTwelveMonths();
	const sql = `SELECT
    u.type,
    DATE_FORMAT(c.create_time, '%Y-%m') AS month,
    COUNT(c.id) AS num_consultations
	FROM users u
	JOIN chat_list c ON u.id = c.user_id
	WHERE u.type IN (2, 3)
	GROUP BY u.type, month
	ORDER BY u.type, month;`;

	Action(sql).then((datas) => {
		const arr = [
			{
				id: 2,
				name: "医生",
				data: Array(12).fill(0),
			},
			{
				id: 3,
				name: "患者",
				data: Array(12).fill(0),
			},
		];

		datas.map((data) => {
			if (data.type == 2) {
				const monthIndex = month.indexOf(data.month); // 获取月份在数组中的索引
				arr[0].data[monthIndex] = data.num_consultations;
			}
			if (data.type == 3) {
				const monthIndex = month.indexOf(data.month); // 获取月份在数组中的索引
				arr[1].data[monthIndex] = data.num_consultations;
			}
		});
		res.send(arr);
	});
}

function generateLastTwelveMonths() {
	const months = [];
	const currentDate = new Date();

	for (let i = 0; i < 12; i++) {
		const tempDate = new Date();
		tempDate.setMonth(currentDate.getMonth() - i);
		const year = tempDate.getFullYear();
		const month = tempDate.getMonth() + 1; // 月份从0开始，需要加1

		// 格式化月份，保证是两位数
		const formattedMonth = month < 10 ? `0${month}` : month.toString();

		months.push(`${year}-${formattedMonth}`);
	}
	return months.reverse();
}

module.exports = {
	getAllUser,
	getTypeNumbers,
	getCommodityPurcharse,
	seasonAnalysis,
	consultAnalysis,
	allSalesTrend,
	allConsuleData
};
