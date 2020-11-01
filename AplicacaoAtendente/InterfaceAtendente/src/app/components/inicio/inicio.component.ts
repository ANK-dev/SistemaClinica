import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { SidenavComponent } from "../sidenav/sidenav.component";

import { MatTableDataSource } from "@angular/material/table";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";

import { EstadosService } from "../../services/estado/estado.service";
import { InicioService } from '../../services/inicio/inicio.service';
import { ConsultaExameProfissionalService } from '../../services/consulta_exame_profissional/consulta-exame-profissional.service';

import { ModalCatalogoComponentInicio } from './modal-catalogo/modal-catalogo.component';
import { ModalEstadosInicioComponent } from './modal-estados-inicio/modal-estados-inicio.component';
import { ModalCEPComponent } from '../modal-cep/modal-cep.component';

import { setData } from '../date'
import { RELOAD_INICIO, DONT_RELOAD_INICIO, emEspera, emConsulta, encerrado } from '../constants';

export interface estadoLista {
    codConsulta: number;
    codTipo: number;
    paciente: string;
    empresa: string;
    dataHora: string;
    codTipoConsulta: number;
    tipo_consulta: string;
    inicio: string;
    termino: string;
}

@Component({
    selector: "app-inicio",
    templateUrl: "./inicio.component.html",
    styleUrls: ["./inicio.component.css"]
})

export class InicioComponent implements OnInit {

    encapsulation: ViewEncapsulation.None;

    displayedColumns: string[] = ['codEstado',"paciente","empresa","dataHora","tipo_consulta","operations"];
    dataSource: MatTableDataSource<estadoLista>;
    dataInput: string;

    constructor(
        private sideNav: SidenavComponent,
        public dialog: MatDialog,
        private estadoService: EstadosService,
        private _snackBar: MatSnackBar,
        private inicioService:InicioService,
        private cepService: ConsultaExameProfissionalService
    ) { }

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    ngOnInit() {
        this.checkInicio();
        this.sideNav.activeView = "Estados";
        this.carregarDadosTabela();
    }

    setFlagCor(estado) {
        switch (estado['estados']) {
            case emEspera:
                estado['cor'] = 'blue'
                break;
            case emConsulta:
                estado['cor'] = 'purple'
                break;
            case encerrado:
                estado['cor'] = 'green'
                break;
            default:
                break;
        }
    }

    checkInicio() {
        this.inicioService.currentInicio.subscribe(message => {
            if (message == RELOAD_INICIO) {
                this.carregarDadosTabela();
                this.inicioService.updateTabelaInicio(DONT_RELOAD_INICIO);
            }
        })
    }

    carregarDadosTabela() {
        this.estadoService.listaDeEstados().subscribe(response => {

            let estados = Object.values(response);

            let dados = estados.map(estado => {

                estado.codEstado=Object.values(estado.estados)[0]['codEstado'];
                estado.estados = Object.values(estado.estados)[0]['codTipo'];

                estado.dataHora = setData(estado.dataHora);
                this.setFlagCor(estado);

                return estado;

            }).filter(estado => estado.estados == encerrado || estado.estados == emEspera || estado.estados == emConsulta);

            this.dataSource = new MatTableDataSource(dados);
            this.dataSource.paginator = this.paginator;
        });

    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    Alert_att() {
        this._snackBar.open("Lista de consultas atualizada !!!", null, {
            duration: 3000,
        });
    }

    visualizar(id) {
        let dialog = this.dialog.open(ModalCEPComponent, {
            width: "650px",
            data: { id: id, tipo: "INICIO" }
        });

        dialog.afterClosed().subscribe(() => {
            this.ngOnInit();
        });
    }

    modalCatalogo() {
        let dialog = this.dialog.open(ModalCatalogoComponentInicio, {
            width: "200px",
        });

        dialog.afterClosed().subscribe(() => {
            this.ngOnInit();
        });
    }

    colocarEncerrado(codConsulta,codEstado) {
        let dialog = this.dialog.open(ModalEstadosInicioComponent, {
          width: "400px",
          data: { id:codConsulta, acao: "ENCERRADO",codEstado:codEstado}
        });

        dialog.afterClosed().subscribe(() => {
          this.ngOnInit();
        });
      }

}
