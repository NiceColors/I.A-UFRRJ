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

    public consultaVizinhos(l: number, c: number) {
        const vizinhos = [];

        // Cima esquerda
        if ((l - 1) >= 0 && (c - 1) >= 0 && this.matriz[l - 1][c - 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push([l - 1, c - 1]);
        }

        // Esquerda
        if ((c - 1) >= 0 && this.matriz[l][c - 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push([l, c - 1]);
        }

        // Baixo esquerda
        if ((l + 1) < this.qtdLinhas && (c - 1) >= 0 && this.matriz[l + 1][c - 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push([l + 1, c - 1]);
        }

        // Baixo
        if ((l + 1) < this.qtdLinhas && this.matriz[l + 1][c] !== EstadoCelula.Obstaculo) {
            vizinhos.push([l + 1, c]);
        }

        // Baixo direita
        if ((l + 1) < this.qtdLinhas && (c + 1) < this.qtdColunas && this.matriz[l + 1][c + 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push([l + 1, c + 1]);
        }
        
        // Direita
        if ((c + 1) < this.qtdColunas && this.matriz[l][c + 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push([l, c + 1]);
        }
        
        // Cima direita
        if ((l - 1) >= 0 && (c + 1) < this.qtdColunas && this.matriz[l - 1][c + 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push([l - 1, c + 1]);
        }

        // Cima
        if ((l - 1) >= 0 && this.matriz[l - 1][c] !== EstadoCelula.Obstaculo) {
            vizinhos.push([l - 1, c]);
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
        for (let l = 0; l < this.qtdLinhas; l++) {
            let string = '|';
            
            for (let c = 0; c < this.qtdColunas; c++) {
                string += this.matriz[l][c];
            }

            string += '|';
            console.log(string);
        }
    }
}