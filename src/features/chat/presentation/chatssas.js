
const vscode = acquireVsCodeApi();
const userInput = document.getElementById("user-input");
const inputContainer = document.querySelector(".input-container");

const commands = [
    {
        command: 'flutter-widget',
        description: 'Genera un widget personalizado de Flutter',
        template: 'Crea un widget de Flutter que '
    },
    {
        command: 'flutter-screen',
        description: 'Genera una pantalla completa de Flutter',
        template: 'Crea una pantalla de Flutter que '
    },
    {
        command: 'flutter-feature',
        description: 'Genera una feature completo de Flutter',
        template: 'Crea una feature de Flutter que '
    },
];

// Crear el menú de comandos e insertarlo en el DOM
const commandMenu = document.createElement('div');
commandMenu.className = 'command-menu';
inputContainer.insertBefore(commandMenu, userInput);


//Menu
function showCommandMenu(filteredCommands) {
    commandMenu.innerHTML = '';
    filteredCommands.forEach(cmd => {
        const item = document.createElement('div');
        item.className = 'command-item';
        item.innerHTML = `
            <i class="${cmd.icon}"></i>
            <div>
                <div>${cmd.command}</div>
                <div class="description">${cmd.description}</div>
            </div>
        `;
        
        item.addEventListener('click', () => {
            userInput.value = cmd.template;
            hideCommandMenu();
            userInput.focus();
        });
        
        commandMenu.appendChild(item);
    });
    commandMenu.classList.add('show');
}

function hideCommandMenu() {
    commandMenu.classList.remove('show');
}
//Menu**


//iput
function handleInput() {
    autoResize();
    const text = userInput.value;
    
    if (text.startsWith('/')) {
        const searchTerm = text.slice(1).toLowerCase();
        const filteredCommands = commands.filter(cmd => 
            cmd.command.toLowerCase().includes(searchTerm) ||
            cmd.description.toLowerCase().includes(searchTerm)
        );
        if (filteredCommands.length > 0) {
            showCommandMenu(filteredCommands);
        } else {
            hideCommandMenu();
        }
    } else {
        hideCommandMenu();
    }
}

function autoResize() {
    userInput.style.height = 'auto';
    const newHeight = Math.min(userInput.scrollHeight, 150);
    userInput.style.height = newHeight + 'px';

    const chatBox = document.getElementById("chat-box");
    chatBox.style.marginBottom = (newHeight + 40) + 'px';

    if (newHeight > 38) {
        inputContainer.classList.add('expanded');
    } else {
        inputContainer.classList.remove('expanded');
    }
}

//input**

// Event Listeners
userInput.addEventListener('input', handleInput);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (commandMenu.classList.contains('show')) {
            const firstCommand = commandMenu.querySelector('.command-item');
            if (firstCommand) {
                firstCommand.click();
            }
        } else {
            sendMessage();
        }
    } else if (e.key === 'Escape') {
        hideCommandMenu();
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.input-container')) {
        hideCommandMenu();
    }
});

document.getElementById("send-button").addEventListener("click", sendMessage);

// Event Listeners**


//Create message
function createMessageElement(text, isUser = true) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    const content = document.createElement("div");
    content.className = "message-content";
    
    if (!isUser) {
        content.innerHTML = text
            .replace(/```([a-z]*)\n([\s\S]*?)```/g, (_, lang, code) => {
                const codeBlock = document.createElement('div');
                codeBlock.className = 'code-block-wrapper';
                codeBlock.innerHTML = `<pre class="language-${lang}"><code class="language-${lang}">${code.trim()}</code></pre>`;
                return codeBlock.outerHTML;
            })
            .replace(/\*\*\*(.*?):\s*([\s\S]*?)(?=\*\*\*|$)/g,
                '<div class="section"><strong>$1:</strong>$2</div>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Si hay bloques de código, añadir botón
        if (text.includes('```')) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';
            
            const getCodeButton = document.createElement('button');
            getCodeButton.className = 'action-button';
            getCodeButton.innerHTML = '<i class="fas fa-code"></i> Obtener código';
            getCodeButton.onclick = () => {
                const codeBlocks = content.querySelectorAll('pre code');
                codeBlocks.forEach(block => {
                    const code = block.textContent;
                    vscode.postMessage({
                        command: "createFile",
                        content: code,
                        language: block.className.replace('language-', '')
                    });
                });
            };
            
            actionsDiv.appendChild(getCodeButton);
            content.appendChild(actionsDiv);
        }
        
        setTimeout(() => {
            content.querySelectorAll('pre code').forEach((block) => {
                Prism.highlightElement(block);
            });
        }, 0);
    } else {
        content.textContent = text;
    }
    
    messageDiv.appendChild(content);
    return messageDiv;
}


async function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;
    
    const chatBox = document.getElementById("chat-box");
    chatBox.appendChild(createMessageElement(text, true));
    chatBox.scrollTop = chatBox.scrollHeight;
    
    const prompt1 = await fetchResponse(`Mejora este prompt para que sea mas optimo: ${text}`);
    const prompt2 = await fetchResponse(`Basado en esta prompt: ${prompt1}, comportate como un Chief Executive Officer y preparala para el Chief Technology Officer`);
    const prompt3 = await fetchResponse(`Basado en esta prompt: ${prompt2}, comportate como un Chief Technology Officer y preparala para el Programmer`);
    const prompt4 = await fetchResponse(`Eres un experto en flutter, con mas de 5 años de experiencia y tienes un maximo de 5 iteraciones para darme la solucion mas escalable, optima, legible de este codigo, pero solo dame la mejor de esas 5 soluciones: ${prompt3}`);
    const aiResponse = await fetchResponse(prompt4);
    vscode.postMessage({
        command: "sendMessage",
        text: aiResponse
    });

    userInput.value = "";
    autoResize();
}
//Create message **


async function fetchResponse(text) {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=AIzaSyBvtF2e8EVOPtVXJrPitW8S4DIc7EuKI_c', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: text
                    }]
                }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        return 'Error: Could not get response from AI';
    }
}


window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.command === "receiveMessage") {
        const chatBox = document.getElementById("chat-box");
        chatBox.appendChild(createMessageElement(message.text, false));
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});