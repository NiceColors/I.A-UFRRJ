import { Direcao } from "../enums/direcao";
import { EstadoCelula } from "../enums/estado-celula";
import { SituacaoBusca } from "../enums/situacao-busca";
import { Celula } from "./celula";
import { Mapa } from './mapa'

export class Robo {
    private roboRef: HTMLElement
    private qtdPassos = 0;
    private locaisParaVisitar: Array<Celula> = new Array();
    private trajeto: Array<Array<number>> = new Array();

    private readonly DELAY_MOVIMENTO = 200;
    private readonly DELAY_ROTACAO = 100;

    constructor(
        private posL: number,
        private posC: number,
        private direcao: Direcao,
        private limiteDePassos: number,
        private mapa: Mapa,
        elementoRaiz: HTMLElement
    ) {
        this.roboRef = elementoRaiz.querySelector('#robo');

        const [largura, altura] = mapa.getTamanhoCelula();
        this.roboRef.style.width = `${Math.max(5, largura - 10)}px`;
        this.roboRef.style.height = `${Math.max(5, altura - 10)}px`;
    }

    public getQtdPassos() {
        return this.qtdPassos;
    }

    public async buscaEmProfundidade(): Promise<SituacaoBusca> {
        this.locaisParaVisitar.push(new Celula(this.posL, this.posC));

        while (this.locaisParaVisitar.length > 0 && this.qtdPassos < this.limiteDePassos) {
            const celula = this.locaisParaVisitar.pop();

            await this.movimentar(celula);

            if (this.mapa.metaEncontrada(this.posL, this.posC)) {
                this.mapa.setCelula(this.posL, this.posC, EstadoCelula.MetaEncontrada);
                return SituacaoBusca.MetaEncontrada;
            }

            this.trajeto.push([this.posL, this.posC]);

            const vizinhos = this.mapa.consultaVizinhos(celula);
            for (let i = 0; i < vizinhos.length; i++) {
                const vizinho = vizinhos[i];
                const localExplorado = this.trajeto.some((v) => {
                    return v[0] === vizinho.linha && v[1] === vizinho.coluna;
                });

                const localJaSeraVisitado = this.locaisParaVisitar.some((v) => {
                    return v.linha === vizinho.linha && v.coluna === vizinho.coluna;
                });

                if (localExplorado || localJaSeraVisitado) {
                    vizinhos.splice(i, 1);
                    i--;
                }
            }
            
            if (vizinhos.length === 0) {
                let celulaTemporaria = celula.pai;
                while (celulaTemporaria !== null) {
                    await this.movimentar(celulaTemporaria);

                    if (!celulaTemporaria.fechado) {
                        break;
                    }

                    celulaTemporaria = celulaTemporaria.pai;
                }
            } else {
                for (const vizinho of vizinhos) {
                    this.locaisParaVisitar.push(vizinho);
                    celula.atribuirFilho(vizinho);
                }
            }
        }

        return (this.qtdPassos >= this.limiteDePassos) ? SituacaoBusca.LimiteDePassosExcedido : SituacaoBusca.MetaNaoEncontrada;
    }

    private async movimentar(celula: Celula) {
        this.girarParaNovaCelula(celula);
        this.qtdPassos++;
        this.mapa.setCelula(this.posL, this.posC, EstadoCelula.Vazia);
        this.posL = celula.linha;
        this.posC = celula.coluna;
        this.mapa.setCelula(this.posL, this.posC, EstadoCelula.Robo);
        celula.receberVisita();

        const [roboTop, roboLeft] = this.mapa.getPosicaoElementoCelulaRobo();
        this.roboRef.style.top = `${roboTop + 5}px`;
        this.roboRef.style.left = `${roboLeft + 5}px`;

        await new Promise(resolve => setTimeout(resolve, this.DELAY_MOVIMENTO));
    }

    // Função que gira o robô para a posicao de uma nova celula considerando diagonal
    private girarParaNovaCelula(celula: Celula): Promise<void> {
        // Calcula a diferença entre a posição atual e a nova posição
        const diferencaL = celula.linha - this.posL;
        const diferencaC = celula.coluna - this.posC;
        
        // Para a direção que devo girar
        let direcaoGirar: Direcao;

        if (diferencaL === 0) {
            if (diferencaC > 0) {
                direcaoGirar = Direcao.Direita;
            } else {
                direcaoGirar = Direcao.Esquerda;
            }
        } else if (diferencaL > 0) {
            if (diferencaC === 0) {
                direcaoGirar = Direcao.Baixo;
            } else if (diferencaC > 0) {
                direcaoGirar = Direcao.DireitaBaixo;
            } else {
                direcaoGirar = Direcao.EsquerdaBaixo;
            }
        } else {
            if (diferencaC === 0) {
                direcaoGirar = Direcao.Cima;
            } else if (diferencaC > 0) {
                direcaoGirar = Direcao.DireitaCima;
            } else {
                direcaoGirar = Direcao.EsquerdaCima;
            }
        }

        this.roboRef.style.transform = `rotate(${direcaoGirar}deg)`;

        return new Promise(resolve => setTimeout(resolve, this.DELAY_ROTACAO));
    }
}
