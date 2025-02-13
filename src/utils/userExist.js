function userExist(user, report_id) {
  const userReports = user.reports_id;

  const exist = userReports.some((item) => item === report_id);

  return exist;
}

export { userExist };
