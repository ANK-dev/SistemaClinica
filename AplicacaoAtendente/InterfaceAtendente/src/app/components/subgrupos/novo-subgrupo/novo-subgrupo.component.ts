import { Component, OnInit } from "@angular/core";
import { SidenavComponent } from "../../sidenav/sidenav.component";
import { map, startWith } from "rxjs/operators";
import { funcao} from '../../../services/funcao/funcao'
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from "@angular/forms";

import { SubgrupoService } from "../../../services/subgrupo/subgrupo.service";
import { FuncaoService } from "../../../services/funcao/funcao.service";
import { SubgruposComponent } from "../subgrupos.component";

import { NovoSubgrupoService } from '../../../services/novo_subgrupo/novo-subgrupo.service';
import { RELOAD_SUBGRUPOS } from '../../constants'

@Component({
    selector: "app-novo-subgrupo",
    templateUrl: "./novo-subgrupo.component.html",
    styleUrls: ["./novo-subgrupo.component.css"]
})
export class NovoSubgrupoComponent implements OnInit {
    formularioNovoSubgrupo: FormGroup;
    executandoRequisicao: Boolean = false;
    funcaoControl = new FormControl("", Validators.required);

    funcoes: funcao[] = [];
    filtroFuncoes: Observable<funcao[]>;


    constructor(
        private att: SubgruposComponent,
        private formBuilder: FormBuilder,
        public sideNav: SidenavComponent,
        private subgrupoService: SubgrupoService,
        private funcaoService: FuncaoService,
        private _snackBar: MatSnackBar,
        private novoSubgrupoService:NovoSubgrupoService
    ) {}

    ngOnInit() {
        this.sideNav.activeView = "Subgrupos > Novo Subgrupo";
        this.carregarFuncoes();
        this.configurarFormulario();
        this.filtrarFuncao();
    }

    async carregarFuncoes() {
        await this.funcaoService.listaDeFuncoes().subscribe(funcoes => {
            Object.values(funcoes).forEach(func => {
                this.funcoes.push(func)
            })
            //this.filtroFuncoes = funcoes;
        });
    }

    configurarFormulario() {
        this.formularioNovoSubgrupo = this.formBuilder.group({
            nome: ['', Validators.required],
            funcao: ['', Validators.required]
        });
    }

    filtrarFuncao() {
        this.carregarFuncoes();
        this.filtroFuncoes = this.formularioNovoSubgrupo.controls['funcao'].valueChanges.pipe(
            startWith(""),
            map(value => (typeof value === "string" ? value : value.nome)),
            map(nome =>
                nome ? this._filtroFuncao(nome) : this.funcoes.slice()
            )
        );
    }

    private _filtroFuncao(nome: string): funcao[] {
        const filterValue = nome.toLocaleLowerCase();
        return this.funcoes.filter(
            funcao => funcao.nome.toLowerCase().indexOf(filterValue) === 0
        );
    }
    displayAutocompleteFuncao(funcao?: funcao): string | undefined {
        return funcao ? funcao.nome : undefined;
    }

    createSubgrupo() {
        let form = this.formularioNovoSubgrupo.value;
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
        this.subgrupoService.cadastrarSubgrupo(form).subscribe(
            response => {
                this.openSnackBar("Cadastro efetuado com sucesso !!!", 1);
                // Reinicia os estados do formulário, também eliminando os erros de required
                this.formularioNovoSubgrupo.reset();
                this.att.ngOnInit();
                this.novoSubgrupoService.updateTabelaSubgrupos(RELOAD_SUBGRUPOS);
                Object.keys(this.formularioNovoSubgrupo.controls).forEach(
                    key => {
                        this.formularioNovoSubgrupo.get(key).setErrors(null);
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
