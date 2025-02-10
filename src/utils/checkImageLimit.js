function checkImageLimit(report) {
  const array = report.childrens.L;
  const findUser = array.some((item) => item.M.user_id.S === user_id);

  return findUser;
}

export { checkImageLimit };
