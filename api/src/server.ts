import Fastify from "fastify";
import multipart from "@fastify/multipart";
import { helloRoutes } from "./routes/hello.js";
import { uploadRoutes } from "./routes/uploadArquivoC.js";
import { jobStatusRoutes } from "./routes/jobStatus.js";

const app = Fastify();

app.register(multipart);

app.register(helloRoutes);
app.register(uploadRoutes);
app.register(jobStatusRoutes);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Server running at http://localhost:3333");
  });
