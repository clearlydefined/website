import http from "http"

http
  .createServer((req, res) =>
    res
      .writeHead(200, { "Content-Type": "application/json" })
      .end(JSON.stringify(process.env.NODE_ENV)),
  )
  .listen()
