const bodyParser = require("body-parser"); // 引入body-parser模块
const express = require("express"); // 引入express模块
const cors = require("cors"); // 引入cors模块
const routes = require("./routes"); //导入自定义路由文件，创建模块化路由
const app = express();

// 设置跨域
app.all("*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header(
		"Access-Control-Allow-Headers",
		"Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
	);
	res.header("X-Powered-By", " 3.2.1");
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

app.use(
	bodyParser.json({
		limit: "50mb",
	})
); // 解析json数据格式
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
); // 解析form表单提交的数据application/x-www-form-urlencoded

app.use(cors()); // 注入cors模块解决跨域

app.use("/", routes);
app.listen(9100, () => {
	console.log("服务器启动成功……  http://localhost:9100");
});
