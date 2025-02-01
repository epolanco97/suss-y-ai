import {CommandEntity} from "../../domain/entities/command-entity";

export class InputComponent {

    commands: CommandEntity[];
    private readonly userInput: any;
    private readonly inputContainer: any;
    private readonly showMenuCallback: () => void;
    private readonly hideMenuCallback: () => void;

    constructor(
        commands: CommandEntity[] = [],
        userInput: any,
        inputContainer: any,
        showMenuCallback: () => void,
        hideMenuCallback: () => void
    ) {
        this.commands = commands;
        this.userInput = userInput;
        this.inputContainer = inputContainer;
        this.showMenuCallback = showMenuCallback;
        this.hideMenuCallback = hideMenuCallback;
    }

    handleInput() {
        if (!this.userInput) {return;}

        this.autoResize();
        const text = this.userInput.value;

        if (text.startsWith("/")) {
            const searchTerm = text.slice(1).toLowerCase();
            const filteredCommands = this.commands.filter(cmd =>
                cmd.command.toLowerCase().includes(searchTerm) ||
                cmd.description.toLowerCase().includes(searchTerm)
            );

            if (filteredCommands.length > 0) {
                this.showMenuCallback();
            } else {
                this.hideMenuCallback();
            }
        } else {
            this.hideMenuCallback();
        }
    }

    autoResize() {
        if (!this.userInput || !this.inputContainer) {return;}

        this.userInput.style.height = "auto";
        const newHeight = Math.min(this.userInput.scrollHeight, 150);
        this.userInput.style.height = `${newHeight}px`;

        const chatBox = document.getElementById("chat-box") as HTMLDivElement;
        if (chatBox) {
            chatBox.style.marginBottom = `${newHeight + 40}px`;
        }

        if (newHeight > 38) {
            this.inputContainer.classList.add("expanded");
        } else {
            this.inputContainer.classList.remove("expanded");
        }
    }
}


