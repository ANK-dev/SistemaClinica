import { Component, OnInit,ViewChild,ViewEncapsulation } from "@angular/core";
import { SidenavComponent } from "../sidenav/sidenav.component";

import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { PacienteService } from "../../services/paciente/paciente.service";
import { paciente } from "../../services/paciente/paciente";
import { ModalPacientesComponent } from './modal-pacientes/modal-pacientes.component';

import {NovoPacienteService} from '../../services/novo_paciente/novo-paciente.service';
import { RELOAD_PACIENTES, DONT_RELOAD_PACIENTES } from '../constants';

@Component({
    selector: "app-pacientes",
    templateUrl: "./pacientes.component.html",
    styleUrls: ["./pacientes.component.css"]
})
export class PacientesComponent implements OnInit {
    encapsulation: ViewEncapsulation.None;
    displayedColumns: string[] = ["name","cpf","rg","nascimento","sexo","operations"];
    dataSource: MatTableDataSource<paciente>;
    dataInput: string;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        public dialog: MatDialog,
        public sideNav: SidenavComponent,
        private pacienteService: PacienteService,
        private _snackBar: MatSnackBar,
        private novoPacienteService:NovoPacienteService
    ) {}

    ngOnInit() {
        this.sideNav.activeView = "Pacientes";
        this.carregarDadosTabela();
        this.checkState();
    }
    checkState() {
        this.novoPacienteService.currentNovoPaciente.subscribe(message=>{
          if(message==RELOAD_PACIENTES){
            this.carregarDadosTabela();
            this.novoPacienteService.updateTabelaPaciente(DONT_RELOAD_PACIENTES)
          }
        })
      }
    async carregarDadosTabela() {
        await this.pacienteService.listaDePacientes().subscribe(pacientes => {
            this.dataSource = new MatTableDataSource(pacientes);
            this.dataSource.paginator = this.paginator;
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    Alert_att(){
        this._snackBar.open("Lista de Pacientes atualizada !!!", null, {
            duration: 3000,
        });
    }

    visualizar(id) {
        let dialog = this.dialog.open(ModalPacientesComponent, {
            width: "700px",
            data: { id: id, acao: "VISUALIZAR" }
        });

        dialog.afterClosed().subscribe(() => {
            this.ngOnInit();
        });
    }

    editar(id) {
        let dialog = this.dialog.open(ModalPacientesComponent, {
            width: "700px",
            data: { id: id, acao: "EDITAR" }
        });
        dialog.afterClosed().subscribe(() => {
            this.ngOnInit();
        });
    }

    deletar(id) {
        let dialog = this.dialog.open(ModalPacientesComponent, {
            width: "400px",
            data: { id: id, acao: "DELETAR" }
        });
        dialog.afterClosed().subscribe(() => {
            this.ngOnInit();
        });
    }
}
