import {GeminiRepository} from "../../domain/repositories/remote/gemini-repository";
import {AiResponseEntity} from "../../domain/entities/ai-response-entity";

export class GetGeminiResponseUseCase {
    private repository: GeminiRepository;

    constructor(repository: GeminiRepository) {
        this.repository = repository;
    }

    async execute(prompt: string): Promise<AiResponseEntity> {
        return await this.repository.getResponse(prompt);
    }
}