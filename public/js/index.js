const socket = io();

// Take the username first
const username = document.querySelector("#username");

username.addEventListener("input", () => {
  username.style.border = "1px solid gray";

  if (username.value.length === 1 && username.value === " ") {
    username.value = "";
  } else {
    username.value = username.value.replace(" ", "_");
  }
});

document.querySelector(".joinForm").addEventListener("click", () => {
  if (username.value !== "") {
    document.querySelector(".middleware").style.display = "none";
    document.querySelector(".name").textContent = username.value;
    socket.emit("user-join", username.value);
  } else {
    username.style.border = "1px solid red";
  }
});

// Creating the rooms
const topics = document.querySelectorAll(".topics");

topics.forEach((topic, index) => {
  topic.addEventListener("click", () => {
    document.querySelector("#messages").innerHTML = "";
    if (index === 0) {
      document.querySelector("#messages").innerHTML = chat1;

      topics[0].style.backgroundColor = "grey";
      topics[1].style.backgroundColor = "transparent";
      topics[2].style.backgroundColor = "transparent";
    } else if (index === 1) {
      document.querySelector("#messages").innerHTML = chat2;

      topics[0].style.backgroundColor = "transparent";
      topics[1].style.backgroundColor = "grey";
      topics[2].style.backgroundColor = "transparent";
    } else if (index === 2) {
      document.querySelector("#messages").innerHTML = chat3;

      topics[0].style.backgroundColor = "transparent";
      topics[1].style.backgroundColor = "transparent";
      topics[2].style.backgroundColor = "grey";
    }
    document.querySelector(".join-room").style.display = "none";
    document.querySelector(".input-box").style.display = "initial";
    document.querySelector(".room-name").textContent = topic.textContent
      .trim()
      .toLowerCase();
    socket.emit("roomname", topic.textContent.trim().toLowerCase());
  });
});

socket.on("message", (message) => {
  console.log(document.querySelector("#messages").innerHTML);
  if (message.id === socket.id) {
    if (message.roomname === "philosophy") {
      chat1 += `<p class="text-center text-blue-500">You have joined the ${message.roomname} group<p/>`;
      document.querySelector("#messages").innerHTML = chat1;
    } else if (message.roomname === "psychology") {
      chat2 += `<p class="text-center text-blue-500">You have joined the ${message.roomname} group<p/>`;
      document.querySelector("#messages").innerHTML = chat2;
    } else if (message.room === "mathematics") {
      chat3 += `<p class="text-center text-blue-500">You have joined the ${message.roomname} group<p/>`;
      document.querySelector("#messages").innerHTML = chat3;
    }
  } else {
    if (message.roomname === "philosophy") {
      chat1 += `<p class="text-center text-blue-500">${message.name} has joined the ${message.roomname} group<p/>`;
      document.querySelector("#messages").innerHTML = chat1;
    } else if (message.roomname === "psychology") {
      chat2 += `<p class="text-center text-blue-500">${message.name} has joined the ${message.roomname} group<p/>`;
      document.querySelector("#messages").innerHTML = chat2;
    } else if (message.roomname === "mathematics") {
      chat3 += `<p class="text-center text-blue-500">${message.name} has joined the ${message.roomname} group<p/>`;
      document.querySelector("#messages").innerHTML = chat3;
    }
  }
});

// hanle Offline
socket.on("offline", (dets) => {
  if (dets.id === socket.id) {
    if (dets.groups === "philosophy") {
      chat1 += `<p class="text-center text-red-500">You have joined the ${dets.groups} group<p/>`;
      document.querySelector("#messages").innerHTML = chat1;
    } else if (dets.groups === "philosophy") {
      chat2 += `<p class="text-center text-red-500">You have joined the ${dets.groups} group<p/>`;
      document.querySelector("#messages").innerHTML = chat2;
    } else if (dets.groups === "mathematics") {
      chat3 += `<p class="text-center text-red-500">You have joined the ${dets.groups} group<p/>`;
      document.querySelector("#messages").innerHTML = chat3;
    }
  } else {
    if (dets.groups === "philosophy") {
      chat1 += `<p class="text-center text-red-500">${dets.username} has joined the ${dets.groups} group<p/>`;
      document.querySelector("#messages").innerHTML = chat1;
    } else if (dets.groups === "philosophy") {
      chat2 += `<p class="text-center text-red-500">${dets.username} has joined the ${dets.groups} group<p/>`;
      document.querySelector("#messages").innerHTML = chat2;
    } else if (dets.groups === "mathematics") {
      chat3 += `<p class="text-center text-red-500">${dets.username} has joined the ${dets.groups} group<p/>`;
      document.querySelector("#messages").innerHTML = chat3;
    }
  }
});

// Group message

const messageInput = document.querySelector("#messageInput");
const send = document.querySelector(".send");

send.addEventListener("click", () => {
  const roomname = document.querySelector(".room-name").textContent;
  if (messageInput.value.trim() === "") {
    messageInput.style.border = "1px solid red";
  } else {
    socket.emit("send-message", { room: roomname, msg: messageInput.value });
    messageInput.value = "";
  }
});

let chat1 = "";
let chat2 = "";
let chat3 = "";
socket.on("send-message", (message) => {
  const date = new Date(message.time);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const clockTime = `${hours}:${minutes} ${ampm}`;
  if (message.room === "philosophy") {
    if (message.id === socket.id) {
      chat1 += `<div class="message flex justify-end">
      <p class="px-4 py-2 rounded-full bg-blue-500 text-white mt-2">${message.msg} <small class="text-[.8vw] mt-5 ml-2 relative right- bottom-0 text-zinc-200">${clockTime}</small></p>
      </div>`;
    } else {
      chat1 += `<div class="message flex">
      <div>
      <small class="text-[1vw] px-2 mb-[-4px]">${message.name}</small>
      <p class="px-4 py-2 rounded-full bg-zinc-200 text-zinc-500 mt-2">
      ${message.msg} <small class="text-[.8vw] mt-5 ml-2 relative right- bottom-0 text-zinc-500">${clockTime}</small>
      </p>
      </div>
      </div>`;
    }
    document.querySelector("#messages").innerHTML = chat1;
  } else if (message.room === "psychology") {
    if (message.id === socket.id) {
      chat2 += `<div class="message flex justify-end">
      <p class="px-4 py-2 rounded-full bg-blue-500 text-white mt-2">${message.msg} <small class="text-[.8vw] mt-5 ml-2 relative right- bottom-0 text-zinc-200">${clockTime}</small></p>
      </div>`;
    } else {
      chat2 += `<div class="message flex">
      <p class="px-4 py-2 rounded-full bg-zinc-200 text-zinc-500 mt-2">
      ${message.msg} <small class="text-[.8vw] mt-5 ml-2 relative right- bottom-0 text-zinc-500">${clockTime}</small>
      </p>
      </div>`;
    }
    document.querySelector("#messages").innerHTML = chat2;
  } else if (message.room === "mathematics") {
    if (message.id === socket.id) {
      chat3 += `<div class="message flex justify-end">
      <p class="px-4 py-2 rounded-full bg-blue-500 text-white mt-2">${message.msg} <small class="text-[.8vw] mt-5 ml-2 relative right- bottom-0 text-zinc-200">${clockTime}</small></p>
      </div>`;
    } else {
      chat3 += `<div class="message flex">
      <p class="px-4 py-2 rounded-full bg-zinc-200 text-zinc-500 mt-2">
      ${message.msg} <small class="text-[.8vw] mt-5 ml-2 relative right- bottom-0 text-zinc-500">${clockTime}</small>
      </p>
      </div>`;
    }
    document.querySelector("#messages").innerHTML = chat3;
  }
});

messageInput.addEventListener("input", () => {
  messageInput.style.border = "1px solid gray";
});
