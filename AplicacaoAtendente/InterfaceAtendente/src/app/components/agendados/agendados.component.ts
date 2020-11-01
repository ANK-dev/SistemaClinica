import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { SidenavComponent } from "../sidenav/sidenav.component";

import { MatTableDataSource } from "@angular/material/table";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";

import { EstadosService } from "../../services/estado/estado.service";
import { PreagendarService } from 'src/app/services/preagendar/preagendar.service';
import { ConsultaExameProfissionalService } from '../../services/consulta_exame_profissional/consulta-exame-profissional.service'

import { ModalCEPComponent } from '../modal-cep/modal-cep.component';
import { ModalCatalogoComponentAgendados } from './modal-catalogo/modal-catalogo.component'
import { ModalEstadosAgendadosComponent } from './modal-estados-agendados/modal-estados-agendados.component';

import { setData } from '../date'
import { RELOAD_AGENDADOS, DONT_RELOAD, agendado, cancelado, atrasado } from '../constants';

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
  estados: any;
}

@Component({
  selector: 'app-agendados',
  templateUrl: './agendados.component.html',
  styleUrls: ['./agendados.component.css'],
})

export class AgendadosComponent implements OnInit {

  encapsulation: ViewEncapsulation.None;

  displayedColumns: string[] = ['codEstado',"paciente","empresa","dataHora","tipo_consulta","operations"];

  dataSource: MatTableDataSource<estadoLista>;
  dataInput: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public sideNav: SidenavComponent,
    private estadoService: EstadosService,
    private preagendarService: PreagendarService,
    private _snackBar: MatSnackBar,
    private cepService: ConsultaExameProfissionalService
  ) { }

  ngOnInit() {
    this.sideNav.activeView = "Estados";
    this.carregarDadosTabela();
    this.checkState();
  }

  setFlagCor(estado) {
    switch (estado['estados']) {
      case agendado:
        estado['cor'] = 'pink'
        break;
      case cancelado:
        estado['cor'] = 'yellow'
        break;

      case atrasado:
        estado['cor'] = 'orange'
        break;

      default:
        break;
    }
  }

  carregarDadosTabela() {
    this.estadoService.listaDeEstados().subscribe(response => {
      let estados=Object.values(response);

      let dados = estados.map(estado => {

        estado.codEstado=Object.values(estado.estados)[0]['codEstado'];
        estado.estados = Object.values(estado.estados)[0]['codTipo'];

        estado.dataHora = setData(estado.dataHora);
        this.setFlagCor(estado);

        return estado;

      }).filter(estado => estado.estados == agendado || estado.estados == cancelado || estado.estados == atrasado);

      this.dataSource = new MatTableDataSource(dados);
      this.dataSource.paginator = this.paginator;
    });

  }

  modalCatalogo() {
    let dialog = this.dialog.open(ModalCatalogoComponentAgendados, {
      width: "200px",
    });

    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
  Alert_att() {
    this._snackBar.open("Lista de Agendados atualizada !!!", null, {
      duration: 3000,
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  checkState() {
    this.preagendarService.currentAgendados.subscribe(message => {
      if (message == RELOAD_AGENDADOS) {
        this.carregarDadosTabela();
        this.preagendarService.updateTabelaAgendados(DONT_RELOAD)
      }
    })
  }


  openSnackBar(mensagem, nivel) {
    switch (nivel) {
      case 1:
        nivel = "alerta-sucesso";
        break;
      case 0:
        nivel = "alerta-fracasso";
        break;
    }
    this._snackBar.open(mensagem, "", {
      duration: 2000,
      panelClass: nivel
    });
  }

  visualizar(id) {
    let dialog = this.dialog.open(ModalCEPComponent, {
      width: "400px",
      data: { id: id, tipo: "AGENDADOS" }
    });

    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  colocarEmEspera(codConsulta,codEstado) {
    let dialog = this.dialog.open(ModalEstadosAgendadosComponent, {
      width: "400px",
      data: { id:codConsulta, acao: "EM ESPERA",codEstado:codEstado}
    });

    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  colocarAtrasado(codConsulta,codEstado) {
    let dialog = this.dialog.open(ModalEstadosAgendadosComponent, {
      width: "400px",
      data: { id:codConsulta, acao: "ATRASADO",codEstado:codEstado}
    });

    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  colocarCancelado(codConsulta,codEstado) {
    let dialog = this.dialog.open(ModalEstadosAgendadosComponent, {
      width: "400px",
      data: { id:codConsulta, acao: "CANCELADO",codEstado:codEstado}
    });

    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  // editar(id) {
  //     let dialog = this.dialog.open(ModalEmpresaComponent, {
  //         width: "700px",
  //         data: { id: id, acao: "EDITAR" }
  //     });
  //     dialog.afterClosed().subscribe(() => {
  //         this.ngOnInit();
  //     });
  // }

  // deletar(id) {
  //     let dialog = this.dialog.open(ModalEmpresaComponent, {
  //         width: "400px",
  //         data: { id: id, acao: "DELETAR" }
  //     });
  //     dialog.afterClosed().subscribe(() => {
  //         this.ngOnInit();
  //     });
  // }
}
