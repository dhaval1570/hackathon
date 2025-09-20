const chatBox = document.querySelector(".chat-box");
const input = document.querySelector("#messageInput");
const sendBtn = document.querySelector("#sendBtn");

// Role is passed from <body data-role="">
const role = document.body.getAttribute("data-role");

// Load existing messages
function loadMessages() {
    chatBox.innerHTML = "";
    let messages = JSON.parse(localStorage.getItem("chat")) || [];

    messages.forEach(msg => {
        let div = document.createElement("div");
        div.classList.add("message", msg.sender);
        div.textContent = msg.sender.toUpperCase() + ": " + msg.text;
        chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send new message
function sendMessage() {
    let text = input.value.trim();
    if (text === "") return;

    let messages = JSON.parse(localStorage.getItem("chat")) || [];
    messages.push({ sender: role, text: text });
    localStorage.setItem("chat", JSON.stringify(messages));

    input.value = "";
    loadMessages();
}

// Auto refresh every second
setInterval(loadMessages, 1000);

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Initial load
loadMessages();