import { verifyUserAuth } from "../hooks/user-auth";

const dealRouters = async (app) => {
  app.post("/deals", { preHandler: [verifyUserAuth] }, getDealReports);
  app.post("/commission-report", {}, getCommissionReport);
  app.post("/commission-report-detail", {}, getCommissionReportDetail);
};

async function getDealReports(req) {
  return await this.reportHandlers.getDealReports(req.body);
}

async function getCommissionReport(req) {
  return await this.reportHandlers.getCommissionReport(req.body);
}

async function getCommissionReportDetail(req) {
  return await this.reportHandlers.getCommissionReportDetail(req.body);
}

export default dealRouters;
