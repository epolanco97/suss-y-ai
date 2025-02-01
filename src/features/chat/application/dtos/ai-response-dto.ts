export class AiResponseDto {
    text: string;
    model: string;

    constructor(text: string, model: string) {
        this.text = text;
        this.model = model;
    }

    static fromJson(json: any): AiResponseDto {
        return new AiResponseDto(
            json.text ?? '',
            json.model ?? ''
        );
    }
}