import { verifyUserAuth } from "../hooks/user-auth";

const showcaseRouters = async (app) => {
  app.post(
    "/",
    {
      preHandler: [verifyUserAuth, app.upload.array("products", 20)],
    },
    createProd
  );
  app.get("/:id", getProdById);
  app.get("/", getProdList);
  app.delete("/:id", deleteProdById);
  app.put("/image/:id", deleteProdImage);
};

async function createProd(req) {
  return await this.showcaseHandlers.createProd(req.user, req.body, req.files);
}

async function getProdById(req) {
  return await this.showcaseHandlers.getProdById(req.params);
}

async function getProdList() {
  return await this.showcaseHandlers.getProdList();
}

async function deleteProdById(req) {
  return await this.showcaseHandlers.deleteProdById(req.params);
}

async function deleteProdImage(req) {
  return await this.showcaseHandlers.deleteProdImage(req.params);
}

export default showcaseRouters;
