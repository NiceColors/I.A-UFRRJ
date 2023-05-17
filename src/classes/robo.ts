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

    private readonly STEP_GIRO = 45;
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
            let celula = this.locaisParaVisitar.pop();

            let metaEncontrada = this.mapa.verificarMetaEncontrada(celula);
            await this.movimentar(celula, metaEncontrada);
            this.trajeto.push([this.posL, this.posC]);

            if (metaEncontrada) {
                return SituacaoBusca.MetaEncontrada;
            }

            const vizinhos = this.mapa.consultaVizinhos(celula);
            for (let i = 0; i < vizinhos.length; i++) {
                const vizinho = vizinhos[i];
                const localExplorado = this.verificaSeJaFoiExplorado(vizinho.linha, vizinho.coluna);
                const localParaVisitar = this.verificaSeJaEstaNaLista(vizinho.linha, vizinho.coluna);

                if (localExplorado || localParaVisitar) {
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
            
            this.qtdPassos++;
        }

        return (this.qtdPassos >= this.limiteDePassos) ? SituacaoBusca.LimiteDePassosExcedido : SituacaoBusca.MetaNaoEncontrada;
    }

    private verificaSeJaFoiExplorado(linha: number, coluna: number) {
        return this.trajeto.some((c) => {
            return c[0] === linha && c[1] === coluna;
        });
    }

    private verificaSeJaEstaNaLista(linha: number, coluna: number) {
        return this.locaisParaVisitar.some((c) => {
            return c.linha === linha && c.coluna === coluna;
        });
    }

    private async movimentar(celula: Celula, metaEncontrada = false) {
        await this.girarParaNovaCelula(celula);
        this.mapa.setCelula(this.posL, this.posC, EstadoCelula.Vazia);
        this.posL = celula.linha;
        this.posC = celula.coluna;
        
        if (metaEncontrada) {
            this.mapa.setCelula(this.posL, this.posC, EstadoCelula.MetaEncontrada);
        } else {
        this.mapa.setCelula(this.posL, this.posC, EstadoCelula.Robo);
        }
        
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
        const direcaoAtual = this.direcao;
        
        if (diferencaL === 0) {
            if (diferencaC > 0) {
                this.direcao = Direcao.Direita;
            } else {
                this.direcao = Direcao.Esquerda;
            }
        } else if (diferencaL > 0) {
            if (diferencaC === 0) {
                this.direcao = Direcao.Baixo;
            } else if (diferencaC > 0) {
                this.direcao = Direcao.DireitaBaixo;
            } else {
                this.direcao = Direcao.EsquerdaBaixo;
            }
        } else {
            if (diferencaC === 0) {
                this.direcao = Direcao.Cima;
            } else if (diferencaC > 0) {
                this.direcao = Direcao.DireitaCima;
            } else {
                this.direcao = Direcao.EsquerdaCima;
            }
        }

        this.roboRef.style.transform = `rotate(${this.direcao}deg)`;

        return new Promise(resolve => setTimeout(resolve, this.DELAY_ROTACAO));
    }
}
