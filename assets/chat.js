class Chat {
     constructor(socket, user) {
          this.socket = socket;
          this.user = user;
          this.chat = document.getElementById("chat");
          this.chat.addEventListener("submit", (e) => {
               e.preventDefault();
               this.sendMessage();
          });
          this.socket.emit("new user", this.user);
          this.chat
               .querySelector("textarea")
               .addEventListener("keydown", (e) => {
                    if (e.keyCode === 13 && !e.shiftKey) {
                         e.preventDefault();
                         this.sendMessage();
                    }
               });
          this.socket.on("chat message", (msg) => {
               this.addMessage(msg);
          });
          this.socket.on(`chat message @${this.user}`, (msg) => {
               this.addMessage(msg);
          });

          this.socket.on("chat @me", (msg) => {
               this.addMessage(String(msg));
          });
     }

     sendMessage() {
          const message = this.chat.querySelector("textarea").value;
          if (message) {
               this.socket.emit("chat message", message);
               this.chat.querySelector("textarea").value = "";
          }
     }

     addMessage(msg) {
          const message = document.createElement("div");
          message.classList.add("message");
          if (typeof msg === "string") {
               message.classList.add("me");
               message.innerHTML = `${msg.replace("\n", "<br />")}`;
               this.chat.querySelector(".messages").appendChild(message);
               this.chat.querySelector(".messages").scrollTop =
                    this.chat.querySelector(".messages").scrollHeight;
          } else {
               if (msg.user === "System") {
                    message.classList.add("system");
               }
               if (msg.direct) {
                    message.classList.add("direct");
               }
               message.innerHTML = `<span class="username">${msg.user}</span> ${msg.message.replace("\n", "<br />")}`;
               this.chat.querySelector(".messages").appendChild(message);
               this.chat.querySelector(".messages").scrollTop =
                    this.chat.querySelector(".messages").scrollHeight;
          }
     }
}
