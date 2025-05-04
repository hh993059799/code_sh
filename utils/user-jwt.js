// 用户权限验证
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { PRIVATE_KEY } = require("./constant");

// 验证token是否过期
const jwtAuth = expressJwt({
  secret: PRIVATE_KEY, // 密钥
  credentialsRequired: true, // 开启验证
  algorithms: ["HS256"],
  // 获取token
  getToken: (req) => {
    if (req.headers.authorization) {
      return req.headers.authorization;
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
  },
}).unless({
  // 设置白名单，如/login、/register不需要验证token
  path: ["/", "/login", "/register", "/api-docs"],
});

const decode = (req) => {
  const token = req.get("Authorization");
  return jwt.verify(token, PRIVATE_KEY);
};

module.exports = {
  jwtAuth,
  decode,
};
