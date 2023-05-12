import { Direcao } from "../enums/direcao";
import { EstadoCelula } from "../enums/estado-celula";
import { Mapa } from './mapa'

export class Robo {
    constructor(
        private posL: number,
        private posC: number,
        private direcao: Direcao,
        private movimento: number,
        private mapa: Mapa
    ) {}

}
