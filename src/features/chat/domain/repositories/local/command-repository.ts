import { CommandEntity } from "../../entities/command-entity";

export interface CommandRepository {
    getCommandList(): CommandEntity[] ;
}