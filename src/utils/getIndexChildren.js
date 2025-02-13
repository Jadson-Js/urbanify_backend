function getIndexChildren(user_email, report) {
  const array = report.childrens.L;

  const findIndex = array.findIndex(
    (item) => item.M.user_email.S === user_email
  );

  return findIndex;
}

export { getIndexChildren };
