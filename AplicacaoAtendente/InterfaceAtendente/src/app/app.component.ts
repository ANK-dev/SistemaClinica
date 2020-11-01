import { Component, OnInit } from '@angular/core';
import { SocketService } from '../app/services/socket/socket.service';
import { PreagendarService } from './services/preagendar/preagendar.service';
import { InicioService } from './services/inicio/inicio.service';
import { RELOAD_AGENDADOS, RELOAD_INICIO, BROADCAST } from '../app/components/constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'InterfaceAtendente';

    constructor(
        private socket: SocketService,
        private preAgendarService: PreagendarService,
        private inicioService: InicioService
    ) { };

    ngOnInit() {
        this.socket.listen("broadcast").subscribe(data => {
            if (data == BROADCAST) {
                this.preAgendarService.updateTabelaAgendados(RELOAD_AGENDADOS);
                this.inicioService.updateTabelaInicio(RELOAD_INICIO);
            }
        })
    }
}
