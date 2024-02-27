import { verifyUserAuth } from "../hooks/user-auth";

const tenderRouters = async (app) => {
  app.post(
    "/",
    {
      preHandler: [verifyUserAuth, app.onlyDocs.array("tenders", 3)],
    },
    createTender
  );
  app.get(
    "/",
    {
      preHandler: [verifyUserAuth],
    },
    getTenderList
  );
  app.get("/:id", {}, getTenderById);
  app.get(
    "/private/all",
    { preHandler: [verifyUserAuth] },
    getTenderPrivaetAllList
  );
  app.get("/public/all", {}, getTenderPublicAllList);
  app.put("/", { preHandler: [verifyUserAuth] }, updateTenderStatus);
  app.delete("/:id", deleteTender);
};

async function createTender(req) {
  return await this.tenderHandlers.createTender(req.body, req.files, req.user);
}

async function getTenderList(req) {
  return await this.tenderHandlers.getTenderList(req.user);
}

async function getTenderById(req) {
  return await this.tenderHandlers.getTenderById(req.params);
}

async function getTenderPrivaetAllList(req) {
  return await this.tenderHandlers.getTenderPrivateAllList(req.user);
}

async function getTenderPublicAllList(req) {
  return await this.tenderHandlers.getTenderPublicAllList();
}

async function updateTenderStatus(req) {
  return await this.tenderHandlers.updateTenderStatus(req.query);
}

async function deleteTender(req) {
  return await this.tenderHandlers.deleteTender(req.params);
}
export default tenderRouters;
