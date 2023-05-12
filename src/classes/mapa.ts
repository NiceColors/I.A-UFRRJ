import { EstadoCelula } from "../enums/estado-celula";

export class Mapa {
    private readonly qtdLinhas: number;
    private readonly qtdColunas: number;
    private matriz: Array<Array<EstadoCelula>> = [];

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
    }

}