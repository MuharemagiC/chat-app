const socket = io();

//Select elements from chat.html
const messageForm = document.querySelector("#message-form");
const sendLocationButton = document.querySelector("#send-location__button");
const messageContainer = document.querySelector("#message-container");
const sidebarContainer = document.querySelector(".sidebar");

//Select templates from chat.html
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Parse url information
const { username, roomName, password } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Auto scroll
const autoscroll = () => {
  // New message element
  const newMessage = messageContainer.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginTop);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibelHeight = messageContainer.offsetHeight;

  // Height of message container
  const containerHeight = messageContainer.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = messageContainer.scrollTop + visibelHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
};

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  sidebarContainer.innerHTML = html;
});

socket.on("locationMessage", (location) => {
  console.log(location);
  const html = Mustache.render(locationTemplate, {
    url: location.url,
    username: location.username,
    createdAt: moment(location.createdAt).format("kk:mm a"),
  });
  messageContainer.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.message,
    username: message.username,
    createdAt: moment(message.createdAt).format("kk:mm a"),
  });
  messageContainer.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("sendMessage", e.target.elements.message.value);
  e.target.elements.message.value = "";
});

sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords;
      socket.emit("sendLocation", { longitude, latitude });
    });
  }
});

socket.emit("join", { username, roomName, password }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
