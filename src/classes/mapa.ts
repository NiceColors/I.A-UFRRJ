import { EstadoCelula } from "../enums/estado-celula";

export class Mapa {
    private readonly qtdLinhas: number;
    private readonly qtdColunas: number;
    private matriz: Array<Array<EstadoCelula>> = [];

    // TODO: Parametrizar os atributos abaixo a partir de uma interface com o usuário
    public readonly COORD_INICIAL = [0, 0];
    public readonly COORD_FINAL = [4, 4];
    public readonly PERCENTUAL_OBSTACULOS = 20;

    constructor(linhas: number, colunas: number) {
        this.qtdLinhas = linhas;
        this.qtdColunas = colunas;
        this.criarMatriz();
    }

    private criarMatriz() {
        const qtdCelulas = this.qtdLinhas * this.qtdColunas;
        const qtdObstaculos = Math.floor((qtdCelulas * this.PERCENTUAL_OBSTACULOS) / 100);
        
        for (let l = 0; l < this.qtdLinhas; l++) {
            this.matriz[l] = new Array<EstadoCelula>();
            for (let c = 0; c < this.qtdColunas; c++) {
                this.matriz[l][c] = EstadoCelula.Vazia;
            }
        }

        this.matriz[this.COORD_INICIAL[0]][this.COORD_INICIAL[1]] = EstadoCelula.Robo;
        this.matriz[this.COORD_FINAL[0]][this.COORD_FINAL[1]] = EstadoCelula.Meta;

        let qtdObstaculosInseridos = 0;
        do {
            const linhaSugerida = Math.floor(Math.random() * this.qtdLinhas);
            const colunaSugerida = Math.floor(Math.random() * this.qtdColunas);
            
            if (this.matriz[linhaSugerida][colunaSugerida] === EstadoCelula.Vazia) {
                this.matriz[linhaSugerida][colunaSugerida] = EstadoCelula.Obstaculo;
                qtdObstaculosInseridos++;
            }

        } while (qtdObstaculos !== qtdObstaculosInseridos);
    }

    }

    public imprimir() {
        for (let l = 0; l < this.qtdLinhas; l++) {
            let string = '|';
            
            for (let c = 0; c < this.qtdColunas; c++) {
                switch (this.matriz[l][c]) {
                    case EstadoCelula.Meta:
                        string += 'x';
                        break;
                    case EstadoCelula.Robo:
                        string += '@';
                        break;
                    case EstadoCelula.Obstaculo:
                        string += 'o';
                        break;
                    case EstadoCelula.Vazia:
                    default:
                        string += '.';
                        break;
                }
            }

            string += '|';
            console.log(string);
        }
    }
}