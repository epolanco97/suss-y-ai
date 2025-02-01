import { GetCommandListUseCase } from "../application/usecases/get-command-list-usecase";
import { CommandRepositoryImpl } from "../data/repositories/local/command-repository-impl";
import { CommandDatasourceImpl } from "../data/datasources/local/command-datasource-impl";
import { InputComponent } from "./components/input-component";
import { GetGeminiResponseUseCase } from "../application/usecases/get-gemini-response-usecase";
import { MenuComponent } from "./components/menu-component";
import { MessageComponent } from "./components/message-component";
import { GeminiDatasourceImpl } from "../data/datasources/remote/gemini-datasource-impl";
import { GeminiRepositoryImpl } from "../data/repositories/remote/gemini-repository-impl";

const userInput = document.getElementById("user-input") as HTMLTextAreaElement;
const inputContainer = document.querySelector(".input-container") as HTMLDivElement;

const commandDatasource = new CommandDatasourceImpl();
const commandRepository = new CommandRepositoryImpl(commandDatasource);
const commandListUseCase = new GetCommandListUseCase(commandRepository);

const geminiDataSource = new GeminiDatasourceImpl();
const geminiRepository = new GeminiRepositoryImpl(geminiDataSource);
const geminiResponseUseCase = new GetGeminiResponseUseCase(geminiRepository);

const commandList = commandListUseCase.execute();

const menuComponent = new MenuComponent(commandList, userInput, inputContainer);

const inputComponent = new InputComponent(
    commandList,
    userInput,
    inputContainer,
    () => menuComponent.showCommandMenu(),
    () => menuComponent.hideCommandMenu()
);

const messageComponent = new MessageComponent(userInput, geminiResponseUseCase, () => inputComponent.autoResize());

const commandMenu = document.createElement('div') as HTMLDivElement;
commandMenu.className = 'command-menu';
inputContainer.insertBefore(commandMenu, userInput);

userInput.addEventListener('input', () => inputComponent.handleInput());
userInput.addEventListener('keydown', async (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (commandMenu.classList.contains('show')) {
            const firstCommand: any = commandMenu.querySelector('.command-item');
            if (firstCommand) {
                firstCommand.click();
            }
        } else {
            await messageComponent.sendMessage();
        }
    } else if (e.key === 'Escape') {
        menuComponent.hideCommandMenu();
    }
});

document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.input-container')) {
        menuComponent.hideCommandMenu();
    }
});

const sendButton = document.getElementById("send-button");
if (sendButton) {
    sendButton.addEventListener("click", () => messageComponent.sendMessage());
}

window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.command === "receiveMessage") {
        const chatBox = document.getElementById("chat-box") as HTMLDivElement;
        chatBox.appendChild(messageComponent.createMessageElement(message.text, false));
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

export function deactivate() {}
