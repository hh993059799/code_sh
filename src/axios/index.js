import { get, post } from "./api";

export default {
	/* 首页相关 */
	getAccountTotal: (parameters) => {
		return post("/home/total/info", parameters);
	},
	getQuestionList: (parameters) => {
		return post("/home/question/account", parameters);
	},
	getKnowledgeList: (parameters) => {
		return post("/home/knowledge/list", parameters);
	},
	getAccount: (parameters) => {
		return post("/login", parameters);
	},
	getCommodityPurcharseData: (parameters) => {
		return post("/home/commodity/purchase", parameters);
	},
	getTypesPurchaseData: () => {
		return post("/home/types/purchase");
	},
	getConsultData: () => {
		return post("/home/consult/list");
	},
	getAllSales: () => {
		return post("/home/all/salles");
	},
	getAllConsult: () => {
		return post("/home/all/consult");
	},
	/* 用户相关 */
	login: (parameters) => {
		return post("/login", parameters);
	},
	addUser: (parameters) => {
		return post("/register", parameters);
	},
	getUserList: (parameters) => {
		return post("/user/list", parameters);
	},
	deleteUser: (parameters) => {
		return post("/user/delete", parameters);
	},
	editUser: (parameters) => {
		return post("/user/edit", parameters);
	},

	/* 类型管理 */
	getTypeList: (parameters) => {
		return post("/types/list", parameters);
	},
	addType: (parameters) => {
		return post("/types/add", parameters);
	},
	editType: (parameters) => {
		return post("/types/edit", parameters);
	},
	deleteType: (parameters) => {
		return post("/types/delete", parameters);
	},

	/* 商品管理 */
	getCommodityList: (parameters) => {
		return post("/commodity/list", parameters);
	},
	addCommodityList: (parameters) => {
		return post("/commodity/add", parameters);
	},
	editCommodityList: (parameters) => {
		return post("/commodity/edit", parameters);
	},
	deleteCommodityList: (parameters) => {
		return post("/commodity/delete", parameters);
	},

	/* 订单管理 */
	getPurchase: (parameters) => {
		return post("/purchase/list", parameters);
	},
	addPurchase: (parameters) => {
		return post("/purchase/add", parameters);
	},
	editPurchase: (parameters) => {
		return post("/purchase/edit", parameters);
	},
	deletePurchase: (parameters) => {
		return post("/purchase/delete", parameters);
	},

	/* 工单 */
	getOrderList: (parameters) => {
		return post("/order/list", parameters);
	},
	addOrder: (parameters) => {
		return post("/order/add", parameters);
	},
	editOrder: (parameters) => {
		return post("/order/edit", parameters);
	},
	deleteOrder: (parameters) => {
		return post("/order/delete", parameters);
	},
	/* 聊天 */
	getChatInfoList: (parameter) => {
		return post("/order/chat/list", parameter);
	},
	addChatInfo: (parameter) => {
		return post("/order/chat/add", parameter);
	},
	chatFinish: (parameter) => {
		return post("/order/chat/finish", parameter);
	},

	/* 商品留言相关 */
	getCommodityMsgList: (parameter) => {
		return post("/message/list", parameter);
	},
	addCommodityMsgList: (parameter) => {
		return post("/message/add", parameter);
	},
};
