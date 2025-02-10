function userExist(user_id, report) {
  const array = report.childrens.L;
  const findUser = array.some((item) => item.M.user_id.S === user_id);

  return findUser;
}

export { userExist };
