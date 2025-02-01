export class CommandDto {
    command: string;
    description: string;
    template: string;

    constructor(command: string, description: string, template: string) {
        this.command = command;
        this.description = description;
        this.template = template;
    }

    static fromJson(json: any): CommandDto {
        return new CommandDto(
            json.command ?? '',
            json.description ?? '',
            json.template ?? ''
        );
    }
}
  