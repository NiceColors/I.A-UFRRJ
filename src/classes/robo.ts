import { Celula } from "./celula";
import { Direcao } from "../enums/direcao";
import { EstadoCelula } from "../enums/estado-celula";
import { Mapa } from './mapa'
import { SituacaoBusca } from "../enums/situacao-busca";
import { SituacaoCelula } from "../enums/situacao-celula";

export class Robo {
    private roboRef: HTMLElement
    private qtdPassos = 0;
    private locaisParaVisitar: Array<Celula> = new Array();
    private trajeto: Array<Array<number>> = new Array();

    private readonly STEP_GIRO = 45;
    private readonly DELAY_MOVIMENTO = 200;
    private readonly DELAY_ROTACAO = 100;

    private comecarHtml = document.querySelector('#comecar');

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

        this.comecarHtml.setAttribute('disabled', 'true');


        this.locaisParaVisitar.push(new Celula(this.posL, this.posC));



        while (this.locaisParaVisitar.length > 0 && this.qtdPassos < this.limiteDePassos) {
            let celula = this.locaisParaVisitar.pop();

            let metaEncontrada = this.mapa.verificarMetaEncontrada(celula);
            await this.movimentar(celula, metaEncontrada);
            this.qtdPassos++;

            this.trajeto.push([this.posL, this.posC]);

            if (metaEncontrada) {

                this.comecarHtml.removeAttribute('disabled');

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
                let celulaTemporaria = celula.raiz;

                while (celulaTemporaria !== null) {
                    await this.movimentar(celulaTemporaria);
                    this.qtdPassos++;

                    if (celulaTemporaria.situacao !== SituacaoCelula.Fechado) {
                        break;
                    }

                    celulaTemporaria = celulaTemporaria.raiz;
                }
            } else {
                for (const vizinho of vizinhos) {
                    this.locaisParaVisitar.push(vizinho);
                    celula.atribuirRamo(vizinho);
                }
            }

        }

        this.comecarHtml.removeAttribute('disabled');

        return (this.qtdPassos >= this.limiteDePassos) ? SituacaoBusca.LimiteDePassosExcedido : SituacaoBusca.MetaNaoEncontrada;
    }
    public async buscaEstrela(): Promise<SituacaoBusca> {


        this.comecarHtml.setAttribute('disabled', 'true');

        const inicio = new Celula(this.posL, this.posC);
        const fim = this.mapa.getMeta();

        const caminho = this.buscarCaminhoAStar(inicio, fim);

        if (caminho) {
            for (let i = 1; i < caminho.length; i++) {
                const celula = caminho[i];
                const metaEncontrada = this.mapa.verificarMetaEncontrada(celula);

                await this.movimentar(celula, metaEncontrada);
                this.qtdPassos++;

                this.trajeto.push([this.posL, this.posC]);

                if (metaEncontrada) {
                    this.comecarHtml.removeAttribute('disabled');

                    return SituacaoBusca.MetaEncontrada;

                }
            }
        }
        this.comecarHtml.removeAttribute('disabled');
        return SituacaoBusca.MetaNaoEncontrada;
    }


    private obterCelulaMenorCusto(celulas: Celula[]): Celula {
        let menorCustoCelula = celulas[0];
        for (let i = 1; i < celulas.length; i++) {
            const celula = celulas[i];
            if (celula.custoF < menorCustoCelula.custoF) {
                menorCustoCelula = celula;
            }
        }
        return menorCustoCelula;
    }

    private construirCaminho(celula: Celula): Celula[] {
        const caminho: Celula[] = [];
        let celulaAtual: Celula | null = celula;

        while (celulaAtual !== null) {
            caminho.unshift(celulaAtual);
            celulaAtual = celulaAtual.raiz;
        }

        return caminho;
    }

    private buscarCaminhoAStar(inicio: Celula, fim: Celula): Celula[] | null {
        const abertos: Celula[] = [];
        const fechados: Celula[] = [];

        abertos.push(inicio);

        while (abertos.length > 0) {
            const nodoAtual = this.obterCelulaMenorCusto(abertos);

            if (nodoAtual === fim) {
                return this.construirCaminho(nodoAtual);
            }

            abertos.splice(abertos.indexOf(nodoAtual), 1);
            fechados.push(nodoAtual);

            const vizinhos = this.mapa.consultaVizinhosEstrela(nodoAtual);
            for (const vizinho of vizinhos) {
                if (fechados.includes(vizinho)) {
                    continue;
                }

                const custoG = nodoAtual.custoG + 1;
                const custoH = this.calcularDistanciaManhattan(vizinho, fim);
                const custoF = custoG + custoH;

                if (!abertos.includes(vizinho) || custoF < vizinho.custoF) {
                    vizinho.raiz = nodoAtual;
                    vizinho.custoG = custoG;
                    vizinho.custoH = custoH;
                    vizinho.custoF = custoF;

                    if (!abertos.includes(vizinho)) {
                        abertos.push(vizinho);
                    }
                }


            }


        }

        return null;
    }


    private calcularDistanciaManhattan(celula1: Celula, celula2: Celula): number {
        const dx = Math.abs(celula1.linha - celula2.linha);
        const dy = Math.abs(celula1.coluna - celula2.coluna);
        return dx + dy;
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
