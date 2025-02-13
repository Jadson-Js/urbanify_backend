function userExist(user_email, report) {
  const array = report.childrens.L;
  const findUser = array.some((item) => item.M.user_email.S === user_email);

  return findUser;
}

export { userExist };
