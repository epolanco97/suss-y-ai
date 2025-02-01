import { AiResponseEntity } from "../../entities/ai-response-entity";

export interface GeminiRepository{
     getResponse(prompt: string): Promise<AiResponseEntity>;
}