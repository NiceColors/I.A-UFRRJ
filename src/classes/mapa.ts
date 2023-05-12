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
        for (let l = 0; l < this.qtdLinhas; l++) {
            this.matriz[l] = new Array<EstadoCelula>();
            for (let c = 0; c < this.qtdColunas; c++) {
                this.matriz[l][c] = EstadoCelula.Vazia;
            }
        }

        this.matriz[this.COORD_INICIAL[0]][this.COORD_INICIAL[1]] = EstadoCelula.Robo;
        this.matriz[this.COORD_FINAL[0]][this.COORD_FINAL[1]] = EstadoCelula.Meta;
    }

}