// md5加密
const crypto = require("crypto"); // 引入crypto加密模块
const md5 = (s) => {
  return crypto
    .createHash("md5")
    .update("" + s)
    .digest("hex");
};

module.exports = md5;
