import { CommandDto } from "../../../application/dtos/command-dto";
import { CommandDatasource } from "../../../domain/datasources/local/command-datasource";

export class CommandDatasourceImpl implements CommandDatasource{
    getCommandList(): CommandDto[] {
        return [
            {
                command: 'flutter-widget',
                description: 'Genera un widget personalizado de Flutter',
                template: 'Crea un widget de Flutter que '
            },
            {
                command: 'flutter-screen',
                description: 'Genera una pantalla completa de Flutter',
                template: 'Crea una pantalla de Flutter que '
            },
            {
                command: 'flutter-feature',
                description: 'Genera una feature completo de Flutter',
                template: 'Crea una feature de Flutter que '
            },
        ];
    }

}