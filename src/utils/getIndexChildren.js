function getIndexChildren(user_id, report) {
  const array = report.childrens.L;

  const findIndex = array.findIndex((item) => item.M.user_id.S === user_id);

  return findIndex;
}

export { getIndexChildren };
