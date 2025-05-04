const mysql = require("mysql");
const configs = require("../db/dbConfig");

const connect = () => {
  const { host, user, password, database } = configs;
  return mysql.createConnection({
    host,
    user,
    password,
    database,
  });
};

const Action = (sql) => {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    } catch (e) {
      reject(e);
    } finally {
      conn.end(); // 释放连接
    }
  });
};

module.exports = {
  Action,
};
