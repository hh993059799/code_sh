// 系统时间
const sd = require("silly-datetime");

module.exports.getSystemTime = () => {
  const time = sd.format(new Date(), "YYYY-MM-DD HH:mm:ss");
  return time;
};

