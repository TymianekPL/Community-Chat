import express from "express";
import * as socketIO from "socket.io";
import APIRouter from "./api";

const app = express();
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
     console.log(`Listening on port ${PORT}`);
});

app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
     );
     res.removeHeader("X-Powered-By");
     next();
});

app.use(express.static("public"));
app.use("/assets", express.static("assets"));

app.use("/api", APIRouter);

const serverIO = new socketIO.Server(server);

serverIO.on("connection", (socket) => {
     console.log("Client connected");
     socket.on("disconnect", () => {
          console.log("Client disconnected");
     });

     socket.on("new user", userName => {
          socket.on("chat message", (msg) => {
               if (msg.replace(/\s/g, "").length == 0) return;
               if (msg.startsWith("@")) {
                    const [user, message] = msg.split(" ");
                    console.log(`${user} -> ${message}`);
                    serverIO.emit(`chat message ${user}`, {
                         user: userName,
                         message: message,
                    });
               } else {
                    socket.emit("chat @me", msg);
                    socket.broadcast.emit("chat message", {
                         user: userName,
                         message: msg,
                    });
               }
          });
     });
});
