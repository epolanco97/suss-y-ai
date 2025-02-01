import { GeminiDatasource } from "../../../domain/datasources/remote/gemini-datasource";
import { AiResponseEntity } from "../../../domain/entities/ai-response-entity";
import { GeminiRepository } from "../../../domain/repositories/remote/gemini-repository";
import {AiResponseMapper} from "../../../application/mappers/ai-response-mapper";

export class GeminiRepositoryImpl implements GeminiRepository{
    private datasource: GeminiDatasource;

    constructor(datasource: GeminiDatasource){
        this.datasource = datasource;
    }
    async getResponse(prompt: string): Promise<AiResponseEntity> {
        return AiResponseMapper.dtoToEntity(await this.datasource.getResponse(prompt));
    }

}