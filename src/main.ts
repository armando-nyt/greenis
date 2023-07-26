import http from "http";
import { getCachedValue, saveValue } from "./cache.js";

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  console.log(req.url);
  const [url, queryParams] = req.url?.split("?") || "";

  switch (url) {
    case "/":
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("pong");
      return;
    case "/ping":
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("pong");
      return;

    case "/save":
      try {
        const key = getParamValue(queryParams, "key");
        const value = getParamValue(queryParams, "value");
        if (!key || !value) throw new Error("missing argument");
        const savedValue = await saveValue(key, value);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(`${key}: ${savedValue}`);
      } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.setHeader("Content-Type", "text/plain");
        res.end("bad request");
      }
      return;

    case "/get":
      try {
        const key = getParamValue(queryParams, "key");
        const value = await getCachedValue(key);
        if (!key) throw new Error("missing argument");
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(value);
      } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.setHeader("Content-Type", "text/plain");
        res.end("bad request");
      }
      return;
    default:
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain");
      res.end("bad request");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

function getParamValue(queries: string, paramKey: string) {
  const pairs = queries.split("&");
  const pair = pairs.find((p) => p.includes(paramKey + "=")) || "";
  const value = pair.split("=")[1];
  return value || "";
}
