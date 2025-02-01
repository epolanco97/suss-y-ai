import { CommandEntity } from "../../domain/entities/command-entity";
import { CommandDto } from "../dtos/command-dto";

export class CommandMapper {
    static dtoToEntity(dto: CommandDto) : CommandEntity {
        return {
            command: dto.command,
            description: dto.description,
            template: dto.template
          };
    }
}