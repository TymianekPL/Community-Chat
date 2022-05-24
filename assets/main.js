const socket = io();

const user = window.sessionStorage.getItem("username") || prompt("What is your name?");
window.sessionStorage.setItem("username", user);

const chat = new Chat(socket, user);
chat.addMessage({
     user: "System",
     message: "Welcome to the chat!"
});