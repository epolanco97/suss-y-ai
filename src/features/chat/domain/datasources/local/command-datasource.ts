import { CommandDto } from "../../../application/dtos/command-dto";

export interface CommandDatasource {
    getCommandList(): CommandDto[] ;
}