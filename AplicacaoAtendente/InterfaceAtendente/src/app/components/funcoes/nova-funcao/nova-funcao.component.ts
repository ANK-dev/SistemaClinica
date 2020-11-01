import { Component, OnInit } from "@angular/core";
import { SidenavComponent } from "../../sidenav/sidenav.component";

import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { FuncaoService } from "../../../services/funcao/funcao.service";
import { FuncoesComponent } from "../funcoes.component";
import { RouterLink } from "@angular/router";

import { NovaFuncaoService } from '../../../services/nova_funcao/nova-funcao.service';
import { RELOAD_FUNCOES } from '../../constants';

@Component({
    selector: "app-nova-funcao",
    templateUrl: "./nova-funcao.component.html",
    styleUrls: ["./nova-funcao.component.css"]
})
export class NovaFuncaoComponent implements OnInit {
    formularioNovaFuncao: FormGroup;
    executandoRequisicao: Boolean = false;

    constructor(
        private att: FuncoesComponent,
        private formBuilder: FormBuilder,
        public sideNav: SidenavComponent,
        private funcaoService: FuncaoService,
        private _snackBar: MatSnackBar,
        private novaFuncaoService:NovaFuncaoService

    ) {}

    ngOnInit() {
        this.sideNav.activeView = "Funções > Nova Função";
        this.configurarFormulario();
    }

    configurarFormulario() {
        this.formularioNovaFuncao = this.formBuilder.group({
            nome: ['', Validators.required],
            descricao: ['', Validators.required],
            setor: ['', Validators.required]
        });
    }

    createFuncao() {
        let form = this.formularioNovaFuncao.value;
        //Testar se algum campo está vazio
        for (let campo in form) {
            if (form[campo]==''){
            this._snackBar.open("Dados em vermelho incorretos ou em branco, não foi possivel cadastrar !!!", null, {
                duration: 6000,
            });
            return;
            }
        }
        //Exibe a barra de progresso
        this.executandoRequisicao = true;

        //Armazenando a resposta para dar feedback ao usuário
        this.funcaoService.cadastrarFuncao(form).subscribe(
            response => {
                this.openSnackBar("Cadastro efetuado com sucesso !!!", 1);
                // Reinicia os estados do formulário, também eliminando os erros de required
                this.att.ngOnInit();
                this.novaFuncaoService.updateTabelaFuncoes(RELOAD_FUNCOES);
                this.formularioNovaFuncao.reset();
                Object.keys(this.formularioNovaFuncao.controls).forEach(key => {
                    this.formularioNovaFuncao.get(key).setErrors(null);
                });
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
