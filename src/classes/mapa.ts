import { EstadoCelula } from "../enums/estado-celula";
import { Celula } from "./celula";

export class Mapa {
    private mapaRef: HTMLElement
    private matriz: Array<Array<EstadoCelula>> = [];
    public posicaoMeta: Array<number> = [];

    constructor(
        private readonly qtdLinhas: number,
        private readonly qtdColunas: number,
        elementoRaiz: HTMLElement
    ) {
        this.mapaRef = elementoRaiz.querySelector('#matriz');
        this.criarMatriz();
    }

    private criarMatriz() {
        this.mapaRef.innerHTML = '';
        
        for (let l = 0; l < this.qtdLinhas; l++) {
            this.matriz[l] = new Array<EstadoCelula>();
            for (let c = 0; c < this.qtdColunas; c++) {
                this.matriz[l][c] = EstadoCelula.Vazia;

                let celula = this.matriz[l][c];

                const divCelula = document.createElement('div');
                divCelula.classList.add('celula');
                divCelula.setAttribute('data-linha', l.toString());
                divCelula.setAttribute('data-coluna', c.toString());
                divCelula.setAttribute('data-type', celula);
                divCelula.setAttribute('title', `Linha: ${l} | Coluna: ${c}`);

                this.mapaRef.appendChild(divCelula);
                this.mapaRef.style.gridTemplateColumns = `repeat(${this.qtdColunas}, 1fr)`;
                this.mapaRef.style.gridTemplateRows = `repeat(${this.qtdLinhas}, 1fr)`;
            }
        }
    }

    public getTamanhoCelula() {
        const celula = this.mapaRef.querySelector(`.celula`);
        const detalhesElemento = celula.getBoundingClientRect();
        return [detalhesElemento.width, detalhesElemento.height];
    }

    public getPosicaoElementoCelulaRobo() {
        let elementoCelula = this.mapaRef.querySelector(`.celula[data-type="${EstadoCelula.Robo}"]`);
        
        if (!elementoCelula) {
            elementoCelula = this.mapaRef.querySelector(`.celula[data-type="${EstadoCelula.MetaEncontrada}"]`);
        } 

        const posicao = elementoCelula.getBoundingClientRect();
        return [posicao.top, posicao.left];
    }
    
    public posicionarRobo(l: number, c: number) {
        this.setCelula(l, c, EstadoCelula.Robo);
    }

    public posicionarMeta(l: number, c: number) {
        this.setCelula(l, c, EstadoCelula.Meta);
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
                this.setCelula(linhaSugerida, colunaSugerida, EstadoCelula.Obstaculo);
                qtdObstaculosInseridos++;
            }

        } while (qtdObstaculos !== qtdObstaculosInseridos);
    }

    public consultaVizinhos(celula: Celula) {
        const vizinhos: Array<Celula> = new Array();

        // Cima esquerda
        if ((celula.linha - 1) >= 0 && (celula.coluna - 1) >= 0 && this.matriz[celula.linha - 1][celula.coluna - 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push(new Celula(celula.linha - 1, celula.coluna - 1, celula));
        }

        // Esquerda
        if ((celula.coluna - 1) >= 0 && this.matriz[celula.linha][celula.coluna - 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push(new Celula(celula.linha, celula.coluna - 1, celula));
        }

        // Baixo esquerda
        if ((celula.linha + 1) < this.qtdLinhas && (celula.coluna - 1) >= 0 && this.matriz[celula.linha + 1][celula.coluna - 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push(new Celula(celula.linha + 1, celula.coluna - 1, celula));
        }

        // Baixo
        if ((celula.linha + 1) < this.qtdLinhas && this.matriz[celula.linha + 1][celula.coluna] !== EstadoCelula.Obstaculo) {
            vizinhos.push(new Celula(celula.linha + 1, celula.coluna, celula));
        }

        // Baixo direita
        if ((celula.linha + 1) < this.qtdLinhas && (celula.coluna + 1) < this.qtdColunas && this.matriz[celula.linha + 1][celula.coluna + 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push(new Celula(celula.linha + 1, celula.coluna + 1, celula));
        }
        
        // Direita
        if ((celula.coluna + 1) < this.qtdColunas && this.matriz[celula.linha][celula.coluna + 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push(new Celula(celula.linha, celula.coluna + 1, celula));
        }
        
        // Cima direita
        if ((celula.linha - 1) >= 0 && (celula.coluna + 1) < this.qtdColunas && this.matriz[celula.linha - 1][celula.coluna + 1] !== EstadoCelula.Obstaculo) {
            vizinhos.push(new Celula(celula.linha - 1, celula.coluna + 1, celula));
        }

        // Cima
        if ((celula.linha - 1) >= 0 && this.matriz[celula.linha - 1][celula.coluna] !== EstadoCelula.Obstaculo) {
            vizinhos.push(new Celula(celula.linha - 1, celula.coluna, celula));
        }

        return vizinhos;
    }

    public setCelula(l: number, c: number, estado: EstadoCelula) {
        this.matriz[l][c] = estado;
        this.mapaRef.querySelector(`.celula[data-linha="${l}"][data-coluna="${c}"]`).setAttribute('data-type', estado);
    }

    public verificarMetaEncontrada(celula: Celula) {
        return this.posicaoMeta[0] === celula.linha && this.posicaoMeta[1] === celula.coluna;
    }

    }

    // private frames = 0;
    // public imprimirDebug() {
    //     this.frames++;
    //     console.log('\nFRAME %d', this.frames);
    //     for (let l = 0; l < this.qtdLinhas; l++) {
    //         let string = '|';
    //         for (let c = 0; c < this.qtdColunas; c++) {
    //             string += this.matriz[l][c];
    //         }
    //         console.log(string + '|');
    //     }
    //     console.log('-------');
    // }
}