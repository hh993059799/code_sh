import axios from "axios";

import { message } from "ant-design-vue";

axios.defaults.baseURL = `http://localhost:9100`;
axios.defaults.timeout = 5000;
axios.defaults.headers.post["Content-Type"] =
	"application/x-www-form-urlencoded;charset=UTF-8";

const msag = err => {
	// 错误信息
	if (err && err.response) {
		switch (err.response.status) {
			case 400:
				message.error(err.response.data.error.details);
				break;
			case 401:
				message.error("未授权，请登录");
				window.open(`${window.location.host}/login`, "");
				break;

			case 403:
				message.error("拒绝访问");
				break;

			case 404:
				message.error("请求地址出错");
				break;

			case 408:
				message.error("请求超时");
				break;

			case 500:
				message.error("服务器内部错误");
				break;

			case 501:
				message.error("服务未实现");
				break;

			case 502:
				message.error("网关错误");
				break;

			case 503:
				message.error("服务不可用");
				break;

			case 504:
				message.error("网关超时");
				break;

			case 505:
				message.error("HTTP版本不受支持");
				break;
			default:
		}
	}
};

// 请求拦截器
axios.interceptors.request.use(config => {
	// header中添加token
	const token = sessionStorage.getItem("token");
	if (token) {
		config.headers.authorization = sessionStorage.getItem("token");
	} else if (config.url == "system/users/add") {
	} else {
		// token不存在，返回登录页
		// if (config.url === "/login" || config.url === "/register") {
		// } else {
		// 	sessionStorage.removeItem("token");
		// 	window.location.href = "/login";
		// }
	}
	return config;
});

// 响应拦截器
axios.interceptors.response.use(
	response => {
		const res = response.data;
		if (response.status !== 200 && res.status !== 200) {
			msag(response);
		} else {
			if (response.data.msg && response.data.code === 0) {
				message.success(response.data.msg);
			} else if (response.data.code === -1) {
				message.warning(response.data.msg);
			}
			return response;
		}
	},
	error => {
		msag(error);
	}
);

// get封装：用于获取资源
export const get = (url, params = {}) => {
	return new Promise((resolve, reject) => {
		axios
			.get(url, {
				params: params
			})
			.then(res => {
				resolve(res);
			})
			.catch(error => {
				reject(error);
			});
	});
};

// post封装：发送数据(新增、编辑、修改等操作)
export const post = (url, data) => {
	return new Promise((resolve, reject) => {
		axios
			.post(url, data)
			.then(res => {
				resolve(res);
			})
			.catch(error => {
				reject(error);
			});
	});
};

// patch封装：用于更新资源，且是局部更新
export const patch = (url, data = {}) => {
	return new Promise((resolve, reject) => {
		axios
			.patch(url, data)
			.then(res => {
				resolve(res);
			})
			.catch(error => {
				reject(error);
			});
	});
};

// put封装：用于添加/更新资源，全部更新
export const put = (url, data = {}) => {
	return new Promise((resolve, reject) => {
		axios
			.put(url, data)
			.then(res => {
				resolve(res);
			})
			.catch(error => {
				reject(error);
			});
	});
};

// delete封装：发送一个删除数据的请求
export const deletes = (url, data) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(url, {
				data
			})
			.then(res => {
				resolve(res);
			})
			.catch(error => {
				reject(error);
			});
	});
};
