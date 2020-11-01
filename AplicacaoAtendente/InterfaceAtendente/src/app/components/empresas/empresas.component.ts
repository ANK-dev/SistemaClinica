import { Component, OnInit, ViewChild,ViewEncapsulation } from "@angular/core";
import { SidenavComponent } from "../sidenav/sidenav.component";

import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { EmpresasService } from "../../services/empresas/empresas.service";
import { ModalEmpresaComponent } from "./modal-empresa/modal-empresa.component";
import {NovaEmpresaService} from '../../services/nova_empresa/nova-empresa.service'
import { RELOAD_EMPRESAS, DONT_RELOAD_EMPRESAS } from '../constants';

export interface empresaLista {
    codEmpresa: number;
    nome: string;
    cnpj: string;
    telefone1: string;
    telefone2: string;
    tipoPgto: any;
}
@Component({
    selector: "app-empresas",
    templateUrl: "./empresas.component.html",
    styleUrls: ["./empresas.component.css"]
})
export class EmpresasComponent implements OnInit {
    displayedColumns: string[] = ["id","name","cnpj","telefones","payment","operations"];
    encapsulation: ViewEncapsulation.None;
    dataSource: MatTableDataSource<empresaLista>;
    dataInput: string;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        public dialog: MatDialog,
        public sideNav: SidenavComponent,
        private empresaService: EmpresasService,
        private _snackBar: MatSnackBar,
        private novaEmpresaService:NovaEmpresaService
    ) {}

    ngOnInit() {
        this.sideNav.activeView = "Empresas";
        this.carregarDadosTabela();
        this.checkState();
    }
    checkState() {
        this.novaEmpresaService.currentEmpresas.subscribe(message => {
            if (message == RELOAD_EMPRESAS) {
                this.carregarDadosTabela();
                this.novaEmpresaService.updateTabelaEmpresas(DONT_RELOAD_EMPRESAS)
            }
        })
    }
    carregarDadosTabela() {
        this.empresaService.listaDeEmpresas().subscribe(empresas => {
            let dados = empresas.map(empresa => {
                empresa.tipoPgto = empresa.tipoPgto == 1 ? "Fatura" : "À vista";
                return empresa;
            });
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

    Alert_att(){
        this._snackBar.open("Lista de Empresas atualizada !!!", null, {
            duration: 3000,
        });
    }

    visualizar(id) {
        let dialog = this.dialog.open(ModalEmpresaComponent, {
            width: "700px",
            data: { id: id, acao: "VISUALIZAR" }
        });

        dialog.afterClosed().subscribe(() => {
            this.ngOnInit();
        });
    }

    editar(id) {
        let dialog = this.dialog.open(ModalEmpresaComponent, {
            width: "700px",
            data: { id: id, acao: "EDITAR" }
        });
        dialog.afterClosed().subscribe(() => {
            this.ngOnInit();
        });
    }

    deletar(id) {
        let dialog = this.dialog.open(ModalEmpresaComponent, {
            width: "400px",
            data: { id: id, acao: "DELETAR" }
        });
        dialog.afterClosed().subscribe(() => {
            this.ngOnInit();
        });
    }
}
