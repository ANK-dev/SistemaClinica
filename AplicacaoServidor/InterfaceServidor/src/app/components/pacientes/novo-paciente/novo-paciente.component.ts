import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PacienteService } from '../../../services/paciente/paciente.service'
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-novo-paciente',
    templateUrl: './novo-paciente.component.html'
})
export class NovoPacienteComponent implements OnInit {

    formularioNovoPaciente: FormGroup
    constructor(public sideNav: SidenavComponent, private formBuilder: FormBuilder,
        private pacienteService: PacienteService,
        private _snackBar: MatSnackBar) { }
    empresas = [];
    executandoRequisicao: Boolean = false;
    ngOnInit() {
        this.sideNav.activeView = "Pacientes > Novo Paciente";
        this.configurarFormulario();
    }

    configurarFormulario() {
        this.formularioNovoPaciente = this.formBuilder.group({
            nome: [''],
            cpf: [''],
            rg: [''],
            sexo: [''],
            dataNascimento: [''],
        });
    }
    createPaciente() {

        let form = this.formularioNovoPaciente.value;
        //Testar se algum campo está vazio
        for (let campo in form) {
            if (form[campo] == null) return;
        }
        //Exibe a barra de progresso
        this.executandoRequisicao = true;

        //Armazenando a resposta para dar feedback ao usuário
        this.pacienteService.cadastrarPaciente(form).subscribe(response => {

            this.openSnackBar("Cadastro efetuado!", 1);
            // Reinicia os estados do formulário, também eliminando os erros de required
            this.formularioNovoPaciente.reset();
            Object.keys(this.formularioNovoPaciente.controls).forEach(key => {
                this.formularioNovoPaciente.get(key).setErrors(null);
            }),
                (err: HttpErrorResponse) => {
                    this.openSnackBar("Não foi possível cadastrar!", 1);
                }
        });

        this.executandoRequisicao = false;
    }

    openSnackBar(mensagem, nivel) {
        switch (nivel) {
            case 1:
                nivel = 'alerta-sucesso';
                break;
            case 0:
                nivel = 'alerta-fracasso';
                break;
        }
        this._snackBar.open(mensagem, "", { duration: 2000, panelClass: nivel });
    }
}
