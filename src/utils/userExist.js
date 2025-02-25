function userExist(user_email, report) {
  const childrens = report.childrens;

  const exist = childrens.some((item) => item.user_email === user_email);

  return exist;
}

export { userExist };
