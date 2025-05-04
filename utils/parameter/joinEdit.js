const joinEdit = (body) => {
  let str1 = ``;
  let values = ``;
  if (body) {
    Object.keys(body).map((key, index) => {
      if (key === "id") {
      } else {
        values += `,${key} = '${body[key]}'`;
      }
    });
    str1 = `set ${values.substr(1)}`;
  }
  return str1;
};

module.exports = joinEdit;
