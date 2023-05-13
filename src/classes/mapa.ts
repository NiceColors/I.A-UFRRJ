import { EstadoCelula } from "../enums/estado-celula";
import { Robo } from "./robo";

export class Mapa {
    private readonly qtdLinhas: number;
    private readonly qtdColunas: number;
    private matriz: Array<Array<EstadoCelula>> = [
        // [0, 0, 0, 2, 0],
        // [0, 0, 0, 0, 0],
        // [1, 1, 1, 0, 0],
        // [1, 0, 1, 0, 0],
        // [3, 0, 1, 0, 0],
    ];
    private posicaoMeta: Array<number> = [];

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

    public getMatriz = () => this.matriz;

    public posicionarRobo(l: number, c: number) {
        this.matriz[l][c] = EstadoCelula.Robo;
    }

    public posicionarMeta(l: number, c: number) {
        this.matriz[l][c] = EstadoCelula.Meta;
        this.posicaoMeta = [l, c];
    }

    public posicionarObstaculos(percentual = 30) {
        const qtdCelulas = this.qtdLinhas * this.qtdColunas;
        const qtdObstaculos = Math.floor((qtdCelulas * percentual) / 100);

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

    public consultaVizinhos(celula: Celula) {
        const vizinhos: Array<Celula> = new Array();

        // // Cima esquerda
        // if ((l - 1) >= 0 && (c - 1) >= 0 && this.matriz[l - 1][c - 1] !== EstadoCelula.Obstaculo) {
        //     vizinhos.push([l - 1, c - 1]);
        // }

        // Esquerda
        if ((celula.coluna - 1) >= 0 && this.matriz[celula.linha][celula.coluna - 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push(new Celula(celula.linha, celula.coluna - 1, celula));
        }

        // // Baixo esquerda
        // if ((l + 1) < this.qtdLinhas && (c - 1) >= 0 && this.matriz[l + 1][c - 1] !== EstadoCelula.Obstaculo) {
        //     vizinhos.push([l + 1, c - 1]);
        // }

        // Baixo
        if ((celula.linha + 1) < this.qtdLinhas && this.matriz[celula.linha + 1][celula.coluna] !== EstadoCelula.Obstaculo) {
            vizinhos.push(new Celula(celula.linha + 1, celula.coluna, celula));
        }

        // // Baixo direita
        // if ((l + 1) < this.qtdLinhas && (c + 1) < this.qtdColunas && this.matriz[l + 1][c + 1] !== EstadoCelula.Obstaculo) {
        //     vizinhos.push([l + 1, c + 1]);
        // }

        // Direita
        if ((celula.coluna + 1) < this.qtdColunas && this.matriz[celula.linha][celula.coluna + 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push(new Celula(celula.linha, celula.coluna + 1, celula));
        }

        // // Cima direita
        // if ((l - 1) >= 0 && (c + 1) < this.qtdColunas && this.matriz[l - 1][c + 1] !== EstadoCelula.Obstaculo) {
        //     vizinhos.push([l - 1, c + 1]);
        // }

        // Cima
        if ((celula.linha - 1) >= 0 && this.matriz[celula.linha - 1][celula.coluna] !== EstadoCelula.Obstaculo) {
            vizinhos.push(new Celula(celula.linha - 1, celula.coluna, celula));
        }

        return vizinhos;
    }

    public setCelula(l: number, c: number, estado: EstadoCelula) {
        this.matriz[l][c] = estado;
    }

    public metaEncontrada(l: number, c: number) {
        return this.posicaoMeta[0] === l && this.posicaoMeta[1] === c;
    }

    public imprimir() {
        const matrizHtml = document.getElementById('matriz');

        matrizHtml.innerHTML = '';

        for (let l = 0; l < this.qtdLinhas; l++) {
            for (let c = 0; c < this.qtdColunas; c++) {
                let celula = this.matriz[l][c];

                const divCelula = document.createElement('div');
                divCelula.classList.add('celula');
                divCelula.setAttribute('data-linha', c.toString());
                divCelula.setAttribute('data-coluna', c.toString());
                divCelula.setAttribute('data-type', celula);

                matrizHtml.appendChild(divCelula);
            }
        }



        console.log(this.matriz.findIndex((linha) => linha.includes(EstadoCelula.Robo)));

    }
}