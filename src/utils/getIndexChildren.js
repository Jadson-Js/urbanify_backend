function getIndexChildren(user_id, report) {
  const array = report.childrens.L;

  const findIndex = array.findIndex((item) => item.M.user_id.S === user_id.S);

  return findIndex;
}

export { getIndexChildren };
