import { CommandMapper } from "../../../application/mappers/command-mapper";
import { CommandDatasource } from "../../../domain/datasources/local/command-datasource";
import { CommandEntity } from "../../../domain/entities/command-entity";
import { CommandRepository } from "../../../domain/repositories/local/command-repository";

export class CommandRepositoryImpl implements CommandRepository {

    private datasource: CommandDatasource;

    constructor(datasource: CommandDatasource) {
        this.datasource = datasource;
    }
    getCommandList(): CommandEntity[] {
        return this.datasource.getCommandList().map(CommandMapper.dtoToEntity);

    }

}