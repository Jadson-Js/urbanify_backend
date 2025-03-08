class ChildrenInReport {
  get(user_email, reports) {
    let childrens = [];

    for (const report of reports) {
      const children = report.childrens.filter(
        (item) => item.user_email === user_email
      );

      childrens.push(children[0]);
    }

    return childrens;
  }

  getIndex(user_email, report) {
    const array = report.childrens;

    const findIndex = array.findIndex((item) => item.user_email === user_email);

    return findIndex;
  }
}

export default new ChildrenInReport();
