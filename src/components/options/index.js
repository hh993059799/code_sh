export default function () {
	return {
		grid: {
			left: "8%",
			containLabel: true
		},
		legend: {
			textStyle: {
				fontSize: 12,
				color: "rgba(255,255,255,0.8)"
			}
		},
		yAxis: {
			type: "value",
			nameTextStyle: {
				fontSize: 12,
				color: "rgba(255,255,255,0.8)",
				padding: [0, 0, 0, 12]
			},
			axisLabel: {
				color: "rgba(255,255,255,0.7)",
				fontSize: 12
			},
			splitLine: {
				show: true,
				lineStyle: { type: "dashed", color: "#213259" }
			},
			scale: true
		},
		xAxis: {
			axisTick: {
				show: false
			},
			axisLabel: {
				color: "rgba(255,255,255,0.7)",
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: "#213259"
				}
			}
		},
		tooltip: { trigger: "axis" }
	};
}
