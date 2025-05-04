<template>
	<div class="charts">
		<div class="charts-box">
			<div class="charts-title">药品销量比例</div>
			<echarts-component
				:option="option"
				:height="250"
			></echarts-component>
		</div>
		<div class="charts-box">
			<div class="charts-title">药品销量</div>
			<echarts-component
				:option="volumeOption"
				:height="250"
			></echarts-component>
		</div>
		<div class="charts-box">
			<div class="charts-title">季节性分析</div>
			<echarts-component
				:option="priceAnalysis"
				:height="250"
			></echarts-component>
		</div>
		<div class="charts-box">
			<div class="charts-title">咨询回复分析</div>
			<echarts-component
				:option="communityOption"
				:height="250"
			></echarts-component>
		</div>
	</div>
</template>

<script>
import EchartsComponent from "@/components/EchartsComponent";
export default {
	components: {
		EchartsComponent,
	},
	data() {
		return {
			option: {},

			// 药品销量
			volumeOption: {
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
					top: "8%",
					bottom: "10%",
					containLabel: true,
				},
				legend: {
					top: "0%",
					right: "0%",
					show: false,
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
				series: [],
			},

			// 季节性分析
			priceAnalysis: {
				xAxis: {
					type: "category",
					axisTick: {
						show: false,
					},
					data: [],
					boundaryGap: false,
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
					bottom: "10%",
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
					show: false,
				},
				tooltip: {
					trigger: "axis",
				},
				series: [],
			},

			// 咨询分析
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
					top: "8%",
					bottom: "10%",
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
					show: false,
				},
				tooltip: {
					trigger: "axis",
				},
				series: [],
			},
		};
	},
	mounted() {
		this.getData();
	},
	methods: {
		getData() {
			// 获取x轴日期
			const months = this.$utils.generateLastTwelveMonths();
			// 获取种类
			this.$Apis.getQuestionList().then((res) => {
				let data = [];
				let total = 0;
				res.data.map((el) => {
					total += el.value;
				});
				res.data.map((el) => {
					data.push({
						name: el.label,
						value: Number((el.value / total) * 100).toFixed(2),
					});
				});
				this.option = {
					grid: {
						left: -1,
						containLabel: true,
						borderWidth: 0, //去掉白边
					},
					tooltip: {
						trigger: "item",
					},
					legend: {
						top: "5%",
						left: "center",
						itemStyle: {
							borderColor: "#2f3349",
						},
						textStyle: {
							color: "white",
						},
					},
					series: [
						{
							name: "药品名称",
							type: "pie",
							radius: ["30%", "60%"],
							top: "10%",
							avoidLabelOverlap: false,
							itemStyle: {
								borderRadius: 10,
								borderColor: "#2f3349",
								borderWidth: 2,
							},
							label: {
								show: false,
								position: "center",
							},
							labelLine: {
								show: false,
							},
							data: data,
						},
					],
				};
			});

			// 获取销量
			this.$Apis.getCommodityPurcharseData().then((res) => {
				const { data } = res;
				this.volumeOption.xAxis.data = months;
				let arr = [];
				data.map((el) => {
					console.log(el);
					arr.push({
						name: el.name,
						data: el.data,
						type: "bar",
					});
				});
				this.volumeOption.series = arr;
			});

			// 季节分析
			this.$Apis.getTypesPurchaseData().then((res) => {
				const { data } = res;
				this.priceAnalysis.xAxis.data = months;
				let arr = [];
				data.map((el) => {
					console.log(el);
					arr.push({
						name: el.name,
						data: el.data,
						type: "line",
					});
				});
				this.priceAnalysis.series = arr;
			});

			// 获取咨询量
			this.$Apis.getConsultData().then((res) => {
				const { data } = res;
				this.communityOption.xAxis.data = months;
				const arr = [];
				data.map((el) => {
					arr.push({
						name: el.name,
						data: el.data,
						type: "bar",
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
.charts {
	display: flex;
	flex-wrap: wrap;
}
.charts-box {
	width: 50%;
	margin-bottom: 8px;
}

.charts-title {
	text-align: center;
	font-size: 16px;
	font-weight: bold;
}
</style>
