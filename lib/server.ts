import express, { Express } from "express";
import compression, { CompressionOptions } from "compression";
import { parseShell } from "./parser";

export function startServer(
  options: { port: number; smell: boolean } = { port: 8080, smell: false }
) {
  const app: Express = express();
  app.use(express.text());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression({ level: 6 } as CompressionOptions));

  app.post("/", function (req, res) {
    const body =
      req.headers["content-type"] == "application/json"
        ? JSON.parse(req.body)
        : req.body;

    if (body) {
      if (Array.isArray(body)) {
        const output = body.map((b) => parseShell(b, { smell: options.smell }));
        return res.json(output);
      } else if (typeof body === "string") {
        return res.json(parseShell(body, { smell: options.smell }));
      }
    }
    return res.status(400).json({ error: "invalid request" });
  });
  app.get("/healthz", (req, res) => {
    res.status(200).send("OK");
  });
  app.listen(options.port, function () {
    console.log(`Example app listening on port ${options.port}!`);
  });
}
