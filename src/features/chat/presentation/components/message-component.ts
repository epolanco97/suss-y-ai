import Prism from 'prismjs';
import {GetGeminiResponseUseCase} from "../../application/usecases/get-gemini-response-usecase";

declare const acquireVsCodeApi: () => { postMessage: (message: any) => void };

export class MessageComponent {

    private userInput: any;
    private geminiUseCase: GetGeminiResponseUseCase;
    private autoResizeCallback: () => void;

    constructor(userInput: any, geminiUseCase: GetGeminiResponseUseCase, autoResizeCallback: () => void) {
        this.userInput = userInput;
        this.geminiUseCase = geminiUseCase;
        this.autoResizeCallback = autoResizeCallback;
    }

    async sendMessage() {
        const vscode = acquireVsCodeApi();
        const text = this.userInput.value.trim();
        if (text === "") return;

        const chatBox = document.getElementById("chat-box") as HTMLDivElement;
        chatBox.appendChild(this.createMessageElement(text, true));
        chatBox.scrollTop = chatBox.scrollHeight;

        const prompt1 = await this.geminiUseCase.execute(`Mejora este prompt para que sea más óptimo: ${text}`);
        const prompt2 = await this.geminiUseCase.execute(`Basado en este prompt: ${prompt1}, compórtate como un CEO y prepáralo para el CTO.`);
        const prompt3 = await this.geminiUseCase.execute(`Basado en este prompt: ${prompt2}, compórtate como un CTO y prepáralo para el Programador.`);
        const prompt4 = await this.geminiUseCase.execute(
            `Eres un experto en Flutter con más de 5 años de experiencia. Tienes un máximo de 5 iteraciones para darme la solución más escalable, óptima y legible de este código. Solo dame la mejor de esas 5 soluciones: ${prompt3}`
        );

        const aiResponse = await this.geminiUseCase.execute(prompt4.text);
        vscode.postMessage({
            command: "sendMessage",
            text: aiResponse,
        });

        this.userInput.value = "";
        this.autoResizeCallback();
    }

    createMessageElement(text: string, isUser: boolean = true): HTMLDivElement {
        const vscode = acquireVsCodeApi();
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${isUser ? "user-message" : "ai-message"}`;
        const content = document.createElement("div");
        content.className = "message-content";

        if (!isUser) {
            content.innerHTML = text
                .replace(/```([a-z]*)\n([\s\S]*?)```/g, (_, lang, code) => {
                    const codeBlock = document.createElement("div");
                    codeBlock.className = "code-block-wrapper";
                    codeBlock.innerHTML = `<pre class="language-${lang}"><code class="language-${lang}">${code.trim()}</code></pre>`;
                    return codeBlock.outerHTML;
                })
                .replace(/\*\*\*(.*?):\s*([\s\S]*?)(?=\*\*\*|$)/g, '<div class="section"><strong>$1:</strong>$2</div>')
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/`(.*?)`/g, "<code>$1</code>");

            if (text.includes("```")) {
                const actionsDiv = document.createElement("div");
                actionsDiv.className = "message-actions";

                const getCodeButton = document.createElement("button");
                getCodeButton.className = "action-button";
                getCodeButton.innerHTML = '<i class="fas fa-code"></i> Obtener código';
                getCodeButton.onclick = () => {
                    const codeBlocks = content.querySelectorAll("pre code");
                    codeBlocks.forEach((block) => {
                        const code = block.textContent;
                        vscode.postMessage({
                            command: "createFile",
                            content: code,
                            language: block.className.replace("language-", ""),
                        });
                    });
                };

                actionsDiv.appendChild(getCodeButton);
                content.appendChild(actionsDiv);
            }

            setTimeout(() => {
                content.querySelectorAll("pre code").forEach((block) => {
                    Prism.highlightElement(block);
                });
            }, 0);
        } else {
            content.textContent = text;
        }

        messageDiv.appendChild(content);
        return messageDiv;
    }
}
