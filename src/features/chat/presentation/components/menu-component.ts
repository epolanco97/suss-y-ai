import { CommandEntity } from "../../domain/entities/command-entity";

export class MenuComponent {

    commands: CommandEntity[];
    private userInput : any;
    private inputContainer : any;

    constructor(commands: CommandEntity[] = [], userInput: any, inputContainer: any) {
        this.commands = commands;
        this.userInput = userInput as HTMLTextAreaElement;
        this.inputContainer = inputContainer;
    }

    showCommandMenu() {
        if (!this.inputContainer || !this.userInput) return;

        this.inputContainer.innerHTML = "";

        this.commands.forEach(cmd => {
            const item = document.createElement("div");
            item.className = "command-item";
            item.innerHTML = `
                <div>
                    <div>${cmd.command}</div>
                    <div class="description">${cmd.description}</div>
                </div>
            `;

            item.addEventListener("click", () => {
                if (this.userInput) {
                    this.userInput.value = cmd.template;
                    this.hideCommandMenu();
                    this.userInput.focus();
                }
            });

            this.inputContainer.appendChild(item);
        });

        this.inputContainer.classList.add("show");
    }

    hideCommandMenu() {
        this.inputContainer.classList.remove("show");
    }
}
