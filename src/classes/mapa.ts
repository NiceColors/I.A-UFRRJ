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
    }

}