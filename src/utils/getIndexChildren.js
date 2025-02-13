function getIndexChildren(user_email, report) {
  const array = report.childrens;

  const findIndex = array.findIndex((item) => item.user_email === user_email);

  return findIndex;
}

export { getIndexChildren };
