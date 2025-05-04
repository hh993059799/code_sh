const joinParameter = (query, body) => {
  // search
  let str = ``;
  let parameters = null;
  if (query) {
    parameters = query;
  }
  if (body) {
    parameters = body;
  }
  const keys = Object.keys(parameters);
  keys.map((key) => {
    if (parameters[key]) {
      if (key !== "status" && key !== 'parentID') {
        if (str === "") {
          str = `where ${key} like '%${parameters[key]}%'`;
        } else {
          str = str + ` and ${key} like '%${parameters[key]}%'`;
        }
      } else {
        if (str === "") {
          str = `where ${key} = '${parameters[key]}'`;
        } else {
          str = str + ` and ${key} = '${parameters[key]}'`;
        }
      }
    }
  });
  return str;
};

module.exports = joinParameter;
