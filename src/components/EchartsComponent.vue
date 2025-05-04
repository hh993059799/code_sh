<template>
	<div class="ems-chart" ref="emschart">
		<div ref="chart" :style="{ height: `${height}px` }"></div>
	</div>
</template>

<script>
import chartOpt from "./options/index";
export default {
	name: "EmsChart",
	props: {
		height: {
			type: Number,
			default: 300
		},
		option: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			myChart: null
		};
	},
	watch: {
		option: {
			handler(newOpt) {
				this.setOption(newOpt);
			},
			deep: true
		}
	},
	mounted() {
		setTimeout(() => {
			this.init();
		}, 100);
	},
	beforeDestroy() {
		this.dispose();
	},
	methods: {
		// 初始化
		init() {
			this.myChart = this.$echarts.init(this.$refs.chart);
			this.myChart.setOption(this.option);
			window.addEventListener("resize", this.resize);
		},
		// 更新
		setOption(option) {
			if (this.myChart) {
				this.myChart.clear();
				const opt = this.merge(chartOpt(), option);
				this.myChart.setOption(opt);
			}

		},
		// 适配
		resize() {
			console.log("resize");
			this.myChart.resize({ width: "auto" });
		},
		// 销毁
		dispose() {
			this.myChart && this.myChart.dispose();
			window.removeEventListener("resize", this.resize);
		},
		// 判断对象
		isObject(obj) {
			return (
				Object.prototype.toString.call(obj) === "[object Object]"
			);
		},
		// 合并
		merge(target, source) {
			for (let sKey in source) {
				if (!Reflect.has(target, sKey)) {
					target[sKey] = source[sKey];
				} else {
					if (this.isObject(source[sKey])) {
						this.merge(target[sKey], source[sKey]);
					} else if (
						Array.isArray(source[sKey]) &&
						sKey === "yAxis"
					) {
						// 双y轴
						const default_yAxis = Object.assign(
							{},
							target[sKey]
						);
						target[sKey] = source[sKey].map((item) => {
							return {
								...default_yAxis,
								...item
							};
						});
					} else {
						target[sKey] = source[sKey];
					}
				}
			}
			return target;
		}
	}
};
</script>

<style></style>
