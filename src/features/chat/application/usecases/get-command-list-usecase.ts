import {CommandRepository} from "../../domain/repositories/local/command-repository";
import {CommandEntity} from "../../domain/entities/command-entity";

export class GetCommandListUseCase{
    private repository: CommandRepository;

    constructor(repository: CommandRepository) {
        this.repository = repository;
    }

    execute() : CommandEntity[] {
        return this.repository.getCommandList();
    }
}