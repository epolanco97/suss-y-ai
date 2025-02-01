import { AiResponseDto } from "../../../application/dtos/ai-response-dto";

export interface GeminiDatasource {
    getResponse(prompt: string): Promise<AiResponseDto>;
}