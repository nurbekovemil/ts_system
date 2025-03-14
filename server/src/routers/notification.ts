import { verifyUserAuth } from "../hooks/user-auth";

const notificationRouters = async (app) => {
  app.post(
    "/",
    {
      preHandler: [verifyUserAuth],
    },
    createNotification
  );
  app.put(
    "/",
    {
      preHandler: [verifyUserAuth],
    },
    updateNotification
  );

  app.get("/", { preHandler: [verifyUserAuth] }, getNotifications);
  app.get("/:nid", { preHandler: [verifyUserAuth] }, getNotificationById);
  app.get("/count", { preHandler: [verifyUserAuth] }, getCountUnreadNotifications);
  app.delete("/:id",{ preHandler: [verifyUserAuth] }, deleteNotificationById);
};

async function createNotification(req) {
  return await this.notificationHandlers.createNotification(req.user, req.body);
}

async function updateNotification(req) {
  return await this.notificationHandlers.updateNotification(req.body);
}

async function getNotifications(req) {
  return await this.notificationHandlers.getNotifications(req.user);
}
async function getNotificationById(req) {
  return await this.notificationHandlers.getNotificationById(req.user, req.params);
}

async function getCountUnreadNotifications(req) {
  return await this.notificationHandlers.getCountUnreadNotifications(req.user);
}
async function deleteNotificationById(req) {
  return await this.notificationHandlers.deleteNotificationById(req.params);
}

export default notificationRouters;
