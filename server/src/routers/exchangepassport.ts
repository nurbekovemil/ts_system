import { verifyUserAuth } from "../hooks/user-auth";

const exchangePassportRouters = async (app) => {
  app.post("/", { preHandler: [verifyUserAuth] }, createExchangePassport);

  app.get("/", { preHandler: [verifyUserAuth] }, getExchangePassportMyList);
  app.get("/all", { preHandler: [verifyUserAuth] }, getExchangePassportAllList);
  app.get("/:id", { preHandler: [verifyUserAuth] }, getExchangePassportById);
  app.post(
    "/epfiles",
    {
      preHandler: [verifyUserAuth, app.onlyDocs.array("passports", 3)],
    },
    uploadExchangePassportFiles
  );
  app.delete("/:id", {}, deleteExchangePassportFileById);

  app.post("/regpay", {}, createRegPayments);
  app.get("/regpay/:id", {}, getPassportRegPays);
  app.get("/regpay/all", {}, getRegPayAllList);
  app.put("/regpay/:id", {}, updateRegPayById);
  app.delete("/regpay/:id", {}, deleteRegPayById);
};

async function createExchangePassport(req) {
  return await this.exchangePassportHandlers.createExchangePassport(req);
}
async function getExchangePassportAllList() {
  return await this.exchangePassportHandlers.getExchangePassportAllList();
}
async function uploadExchangePassportFiles(req) {
  return await this.exchangePassportHandlers.uploadExchangePassportFiles(
    req.body,
    req.files
  );
}
async function getExchangePassportMyList(req) {
  return await this.exchangePassportHandlers.getExchangePassportMyList(
    req.user
  );
}
async function getExchangePassportById(req) {
  return await this.exchangePassportHandlers.getExchangePassportById(
    req.params,
    req.user
  );
}
async function deleteExchangePassportFileById(req) {
  return await this.exchangePassportHandlers.deleteExchangePassportFileById(
    req.params
  );
}

async function createRegPayments(req) {
  return await this.exchangePassportHandlers.createRegPayments(req.body);
}
async function getPassportRegPays(req) {
  return await this.exchangePassportHandlers.getPassportRegPays(req.params);
}
async function getRegPayAllList() {
  return await this.exchangePassportHandlers.getRegPayAllList();
}
async function updateRegPayById(req) {
  return await this.exchangePassportHandlers.updateRegPayById(req.params);
}
async function deleteRegPayById(req) {
  return await this.exchangePassportHandlers.deleteRegPayById(req.params);
}
export default exchangePassportRouters;
