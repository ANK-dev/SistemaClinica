import { Component, OnInit } from "@angular/core";
import { SidenavComponent } from "../../sidenav/sidenav.component";

import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { EmpresasService } from "../../../services/empresas/empresas.service";
import { NovaEmpresaService } from '../../../services/nova_empresa/nova-empresa.service'

import {RELOAD_EMPRESAS} from '../../constants';

@Component({
    selector: "app-nova-empresa-rapida",
    templateUrl: "./nova-empresa-rapida.component.html",
    styleUrls: ["./nova-empresa-rapida.component.css"]
})
export class NovaEmpresaRapidaComponent implements OnInit {
    formularioNovaEmpresa: FormGroup;
    executandoRequisicao: Boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        public sideNav: SidenavComponent,
        private empresaService: EmpresasService,
        private _snackBar: MatSnackBar,
        private novaEmpresaService:NovaEmpresaService
    ) {}

    ngOnInit() {
        this.sideNav.activeView = "Empresas > Nova Empresa";
        this.configurarFormulario();
    }

    isValidFormSubmitted = null;

    configurarFormulario() {
        this.formularioNovaEmpresa = this.formBuilder.group({
            nome: [null, Validators.required],
            cnpj: [null],
            telefone1: [null],
            telefone2: [null],
            tipoPgto: [null],
            rua: [null],
            numero: [null],
            bairro: [null],
            cidade: [null],
            cep: [null],
            estado: [null]
        });
    }

    createEmpresa() {
        let form = this.formularioNovaEmpresa.value;
   
        //Testa se algum campo não esta esta seguindo o padrão de validação 
        if (this.formularioNovaEmpresa.invalid) {
            this.executandoRequisicao = false;
            this._snackBar.open("Dados em vermelho incorretos ou em branco, não foi possivel cadastrar !!!", null, {
                duration: 6000,
            });
            return;
        }

        //Exibe a barra de progresso
        this.executandoRequisicao = true;

        //Armazenando a resposta para dar feedback ao usuário
        this.empresaService.cadastrarEmpresa(form).subscribe(
            response => {
                this.openSnackBar("Cadastro efetuado com sucesso !!!", 1);
                // Reinicia os estados do formulário, também eliminando os erros de required
                //this.att.ngOnInit();
                this.novaEmpresaService.updateTabelaEmpresas(RELOAD_EMPRESAS);
                this.formularioNovaEmpresa.reset();
                Object.keys(this.formularioNovaEmpresa.controls).forEach(
                    key => {
                        this.formularioNovaEmpresa.get(key).setErrors(null);
                    }
                );
            },
            error => {
                this.openSnackBar("Erro! Cadastro não realizado.", 0);
            }
        );

        this.executandoRequisicao = false;
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
}
