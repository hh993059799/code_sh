const joinInsert = (body) => {
  let str1 = ``;
  let values = ``;
  let nl = ``;
  if (body) {
    Object.values(body).map((val) => {
      if (val === "NULL") {
        nl = `${val},`;
      } else {
        values += `,'${val}'`;
      }
    });
    str1 = `(${nl}${values.substr(1)})`;
  }
  return str1;
};

module.exports = joinInsert;
