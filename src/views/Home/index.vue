<template>
	<div style="display: flex; flex-wrap: wrap">
		<div style="width: 40%">
			<card-box width="100%" height="260px" title="用户信息">
				<div class="user-infos">
					<a-avatar
						:size="64"
						:src="
							userInfo.image
								? userInfo.image
								: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
						"
					/>
					<div
						class="info"
						v-for="(item, index) in infoList"
						:key="index"
					>
						<div class="label">{{ item.label }}：</div>
						<div class="content">
							<div v-if="item.props == 'role'">
								{{
									userInfo[item.props] == 1
										? "超级管理员"
										: userInfo[item.props] == 2
										? "医生"
										: "普通用户"
								}}
							</div>
							<div v-else>{{ userInfo[item.props] }}</div>
						</div>
					</div>
				</div>
			</card-box>
			<card-box
				width="100%"
				height="600px"
				title="平台数据（近十二个月）"
			>
				<question-trend></question-trend>
			</card-box>
		</div>
		<div style="width: calc(60% - 16px); margin-left: 16px">
			<div style="height: 280px; display: flex; flex-wrap: wrap">
				<card-box
					width="49%"
					style="margin-right: 16px"
					title="系统总人数"
				>
					<div style="font-size: 16px">{{ userTotal }} 人</div>
				</card-box>
				<card-box width="49%" title="药品种类">
					<div style="font-size: 16px">{{ konwTotal }} 种</div>
				</card-box>
				<card-box
					width="49%"
					style="margin-right: 16px"
					title="近七日热门药品"
				>
					<div style="font-size: 16px">{{ hot }}</div>
				</card-box>
				<card-box width="49%" title="系统时间">
					<div style="font-size: 16px">{{ time }}</div>
				</card-box>
			</div>
			<card-box width="100%" height="600px" title="数据分析">
				<div class="analysis-box">
					<div class="charts-box" style="margin-bottom: 8px">
						<div class="charts-title">全量销售趋势</div>
						<echarts-component
							:option="trendOptions"
							:height="230"
						></echarts-component>
					</div>
					<div class="charts-box">
						<div class="charts-title">全量咨询数据</div>
						<echarts-component
							:option="communityOption"
							:height="230"
						></echarts-component>
					</div>
				</div>
			</card-box>
		</div>
		<div style="width: 100%">
			<card-box width="100%" height="100%" title="最近购买记录">
				<question-list></question-list>
			</card-box>
		</div>
	</div>
</template>

<script>
import QuestionList from "./components/QuestionList";
import QuestionTrend from "./components/QuestionTrend";
import EchartsComponent from "@/components/EchartsComponent";
export default {
	components: {
		QuestionList,
		QuestionTrend,
		EchartsComponent,
	},
	created() {
		this.getData();
	},
	mounted() {
		setInterval(() => {
			this.time = this.$moment().format("YYYY-MM-DD HH:mm:ss");
		}, 1000);
	},
	data() {
		return {
			time: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
			userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
			infoList: [
				{
					label: "昵称",
					props: "username",
				},
				{
					label: "账号密码",
					props: "password",
				},
				{
					label: "账号类型",
					props: "role",
				},
			],
			userTotal: 0,
			konwTotal: 0,
			hot: "-",

			option: {
				xAxis: {
					type: "category",
					axisTick: {
						show: false,
					},
					data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				},
				yAxis: {
					type: "value",
					nameTextStyle: {
						color: "#fff",
						fontSize: 12,
						padding: [0, 0, 5, -20],
					},
					splitLine: {
						show: true, // 显示 Y 轴虚线
						lineStyle: {
							type: "dashed", // 设置虚线样式
							color: "#A2ABBB", // 设置虚线的颜色
						},
					},
				},
				grid: {
					left: "2%",
					right: "2%",
					top: "8%",
					bottom: "0%",
					containLabel: true,
				},
				legend: {
					top: "0%",
					right: "0%",
					textStyle: {
						color: "rgba(0,0,0)",
					},
					icon: "roundRect",
					itemWidth: 12,
					itemHeight: 4,
				},
				tooltip: {
					trigger: "axis",
				},
				series: [
					{
						data: [150, 230, 224, 218, 135, 147, 260],
						type: "line",
					},
				],
			},

			trendOptions: {
				xAxis: {
					type: "category",
					axisTick: {
						show: false,
					},
					data: [],
				},
				yAxis: {
					type: "value",
					nameTextStyle: {
						color: "#fff",
						fontSize: 12,
						padding: [0, 0, 5, -20],
					},
					splitLine: {
						show: true, // 显示 Y 轴虚线
						lineStyle: {
							type: "dashed", // 设置虚线样式
							color: "#A2ABBB", // 设置虚线的颜色
						},
					},
				},
				grid: {
					left: "2%",
					right: "2%",
					top: "12%",
					bottom: "10%",
					containLabel: true,
				},
				legend: {
					top: "0",
					right: "0%",
					textStyle: {
						color: "#fff",
					},
					icon: "roundRect",
					itemWidth: 12,
					itemHeight: 4,
				},
				tooltip: {
					trigger: "axis",
				},
				series: [],
			},
			communityOption: {
				xAxis: {
					type: "category",
					axisTick: {
						show: false,
					},
					data: [],
				},
				yAxis: {
					type: "value",
					nameTextStyle: {
						color: "#fff",
						fontSize: 12,
						padding: [0, 0, 5, -20],
					},
					splitLine: {
						show: true, // 显示 Y 轴虚线
						lineStyle: {
							type: "dashed", // 设置虚线样式
							color: "#A2ABBB", // 设置虚线的颜色
						},
					},
				},
				grid: {
					left: "2%",
					right: "2%",
					top: "12%",
					bottom: "10%",
					containLabel: true,
				},
				legend: {
					top: "0%",
					right: "0%",
					textStyle: {
						color: "#fff",
					},
					icon: "roundRect",
					itemWidth: 12,
					itemHeight: 4,
				},
				tooltip: {
					trigger: "axis",
				},
				series: [],
			},
		};
	},
	methods: {
		getData() {
			// 获取x轴日期
			const months = this.$utils.generateLastTwelveMonths();
			this.$Apis.getAccountTotal().then((res) => {
				console.log(res);
				this.userTotal = res.data.user_total;
				this.konwTotal = res.data.kown_total;
			});
			this.$Apis.getQuestionList().then((res) => {
				console.log(res);

				const arr = res.data.map(({ value }) => value);
				const max = Math.max(...arr);

				res.data.map((el) => {
					if (el.value == max) {
						this.hot = el.label;
					}
				});
			});

			// 获取全量销售数据
			this.$Apis.getAllSales().then((res) => {
				const { data } = res;
				this.trendOptions.xAxis.data = months;
				let arr = [];
				data.map((el) => {
					console.log(el);
					arr.push({
						name: el.name,
						data: el.data,
						type: "line",
					});
				});
				this.trendOptions.series = arr;
			});

			// 获取全量咨询
			this.$Apis.getAllConsult().then((res) => {
				const { data } = res;
				this.communityOption.xAxis.data = months;
				const arr = [];
				data.map((el) => {
					arr.push({
						name: el.name,
						data: el.data,
						type: "line",
					});
				});
				this.communityOption.series = arr;
				console.log(data);
			});
		},
	},
};
</script>

<style lang="less" scoped>
.user-infos {
	margin-left: 26px;

	.info {
		width: 100%;
		display: flex;
		align-items: center;
		// height: 35px;
		margin-top: 16px;

		.label {
			font-size: 16px;
			font-weight: 500;
		}
	}
}

.analysis-box {
	.charts-box {
		.charts-title {
			font-size: 16px;
			font-weight: bold;
		}
	}
}
</style>
