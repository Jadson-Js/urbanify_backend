function userExist(user, report_id) {
  const userReports = user.reports_id.L;

  const exist = userReports.some((item) => item.S === report_id);

  return exist;
}

export { userExist };
