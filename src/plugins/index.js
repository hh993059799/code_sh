
export default {
	// 文件转base64
	fileToBase64: () => {},
	// 生成最近十二个月的年份和月份数组
	generateLastTwelveMonths: () => {
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
	},
};
