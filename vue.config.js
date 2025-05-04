module.exports = {
	publicPath: "./",
	devServer: {
		port: 9101, // 启动端口号
		open: true // 启动后是否自动打开网页
	},
	css: {
		loaderOptions: {
			less: {
				modifyVars: {
					"@component-background": "#2f3248", // 大多数组件底色
					"primary-color": "#6F48FF",
					"link-color": "#6F48FF",
					"success-color": "#52c41a",
					"warning-color": "#faad14",
					"error-color": "#f5222d",
					"font-size-base": "14px",
					"heading-color": "rgba(0, 0, 0, 0.85)",
					"text-color": "#ffffff",
					"text-color-secondary": "rgba(0, 0, 0, 0.45)",
					"@border-color-base": "#404656", // 基本轮廓色
					"disabled-color": "rgba(0, 0, 0, 0.25)",
					"body-background": " #fff",

					// layout
					"layout-sider-background": "#2f3248",
					"layout-header-background": "#2f3248",

					// menu
					"@menu-dark-bg": "#2f3248",
					"@menu-dark-submenu-bg": "#2f3248",
					"@menu--dark-highlight-color": "#ffffff",
					"@menu-item-dark-active-bg": "#635ccb",
					"@menu-item-dark-color": "#ffffff",
					"@menu-dark-item-hover-bg": "#635ccb",
					"@menu-dark-selected-item-icon-color": "white",
					"@menu-dark-selected-item-text-color": "white",

					// table
					"@table-header-bg": "#343d55",
					"@table-body-bg": "#343d55",
					"@table-header-color": "#ffffff",
					"@table-row-hover-bg": "#2f3248",
					"@table-selected-row-bg": "@component-background", // 选中后的颜色
					"@table-expanded-row-bg": "rgba(255,255,255,0.04)", // 伸缩表格背景色

					// form
					"label-color": "#ffffff",
					"form-item-trailing-colon": false,

					// dropDown
					"@dropdown-selected-color": "#635ccb"
				},
				javascriptEnabled: true,
				// 兼容 less-loader 3.x
				math: "always"
			}
		}
	}
};
