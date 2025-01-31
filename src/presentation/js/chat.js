const vscode = acquireVsCodeApi();
const userInput = document.getElementById("user-input");
const inputContainer = document.querySelector(".input-container");

// Función para ajustar la altura del textarea
function autoResize() {
    // Resetear la altura para obtener la altura correcta
    userInput.style.height = 'auto';
    // Establecer la nueva altura basada en el contenido
    const newHeight = Math.min(userInput.scrollHeight, 150);
    userInput.style.height = newHeight + 'px';

    // Ajustar el margen del chat-box
    const chatBox = document.getElementById("chat-box");
    chatBox.style.marginBottom = (newHeight + 40) + 'px';

    // Añadir clase cuando hay múltiples líneas
    if (newHeight > 38) {
        inputContainer.classList.add('expanded');
    } else {
        inputContainer.classList.remove('expanded');
    }
}

// Eventos para el textarea
userInput.addEventListener('input', autoResize);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

document.getElementById("send-button").addEventListener("click", sendMessage);

function createMessageElement(text, isUser = true) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = text;

    messageDiv.appendChild(content);
    return messageDiv;
}

function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    const chatBox = document.getElementById("chat-box");
    chatBox.appendChild(createMessageElement(text, true));
    chatBox.scrollTop = chatBox.scrollHeight;

    vscode.postMessage({
        command: "sendMessage",
        text: text
    });

    userInput.value = "";
    // Resetear la altura del textarea después de enviar
    autoResize();
}

window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.command === "receiveMessage") {
        const chatBox = document.getElementById("chat-box");
        chatBox.appendChild(createMessageElement(message.text, false));
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
