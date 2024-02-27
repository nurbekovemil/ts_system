import { FastifyServerOptions } from "fastify";
import buildApp from "./app";
import config from "./config";

const options: FastifyServerOptions = {
  logger: true,
};

const { port } = config.server;

const app = buildApp(options);

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("Server started on port ", port);
});
