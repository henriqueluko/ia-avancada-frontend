import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const button = document.getElementById("send-btn");

let generator;

// Carrega modelo (demora na primeira vez)
async function loadModel() {
    addMessage("Sistema", "Carregando modelo de IA...");
    generator = await pipeline(
        "text-generation",
        "Xenova/distilgpt2"
    );
    addMessage("Sistema", "Modelo carregado. Pode conversar.");
}

function addMessage(sender, text) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.classList.add(sender === "Você" ? "user" : "bot");
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const userText = input.value;
    if (!userText) return;

    addMessage("Você", userText);
    input.value = "";

    const output = await generator(userText, {
        max_new_tokens: 60,
        temperature: 0.7
    });

    const resposta = output[0].generated_text;
    addMessage("IA", resposta);
}

button.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});

loadModel();