const socket = io.connect("/");

const message = document.getElementById("message");
const username = document.getElementById("username");
const btn = document.getElementById("send");
const output = document.getElementById("output");
const feedback = document.getElementById("feedback");

btn.addEventListener("click", () => {
  socket.emit("chat", {
    message: message.value,
    username: username.value,
    createdAt: new Date(),
    id: new Date().getTime(),
  });
  message.value = "";
});

message.addEventListener("keypress", () => {
  socket.emit("typing", username.value);
});

socket.on("chat", (data) => appendMessage(data));

fetch("/messages").then(async (data) => {
  const messages = await data.json();
  for (const message of messages) appendMessage(message);
});

function appendMessage(data) {
  output.innerHTML += extremelyLongMessagePreview(data);
}
