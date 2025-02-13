function getChildrenInReport(user_email, reports) {
  let childrens = [];

  for (const report of reports) {
    const children = report.childrens.filter(
      (item) => item.user_email === user_email
    );

    childrens.push(children[0]);
  }

  return childrens;
}

export { getChildrenInReport };
