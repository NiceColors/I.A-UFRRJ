import { Direcao } from "../enums/direcao";
import { EstadoCelula } from "../enums/estado-celula";
import { Mapa } from './mapa'

export class Robo {
    private locaisParaVisitar: Array<Array<number>> = new Array();

    constructor(
        private posL: number,
        private posC: number,
        private direcao: Direcao,
        private movimento: number,
        private mapa: Mapa
    ) {}

    private trajeto: Array<Array<number>> = new Array();

    public search() {
        console.log('FRAME 1');
        this.mapa.imprimir();
        console.log('-------');
        
        let qtdPassos = 0;
        this.locaisParaVisitar.push([this.posL, this.posC]);
        this.trajeto.push([this.posL, this.posC]);

        // console.log(this.locaisParaVisitar);

        while (this.locaisParaVisitar.length > 0 && qtdPassos < 10) {
            const vizinhos = this.mapa.consultaVizinhos(this.posL, this.posC);

            for (const vizinho of vizinhos) {
                const localExplorado = this.trajeto.some((v) => {
                    return v[0] === vizinho[0] && v[1] === vizinho[1];
                });

                if (!localExplorado) {
                    this.locaisParaVisitar.push(vizinho);
                }
            }

            const [novaPosX, novaPosY] = this.locaisParaVisitar.pop();
    
            this.movimentar(novaPosX, novaPosY);
            qtdPassos++;

            console.log('\nFRAME %d', qtdPassos + 1);
            this.mapa.imprimir();
            console.log('-------');

            if (this.mapa.metaEncontrada(this.posL, this.posC)) {
                return;
            }
            // console.log(this.locaisParaVisitar);
        }
    }

    private movimentar(posL: number, posC: number) {
        this.mapa.setCelula(this.posL, this.posC, EstadoCelula.Vazia);

        this.posL = posL;
        this.posC = posC;

        this.trajeto.push([this.posL, this.posC]);
        this.mapa.setCelula(this.posL, this.posC, EstadoCelula.Robo);
    }
}
