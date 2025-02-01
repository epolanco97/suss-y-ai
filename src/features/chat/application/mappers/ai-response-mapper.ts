import { AiResponseEntity } from "../../domain/entities/ai-response-entity";
import { AiResponseDto } from "../dtos/ai-response-dto";

export class AiResponseMapper{
    static dtoToEntity(dto: AiResponseDto): AiResponseEntity{
        return {
            text: dto.text ?? '',
            model: dto.model ?? ''
        };
    }
}