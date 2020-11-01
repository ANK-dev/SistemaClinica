import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PacienteService } from '../../../services/paciente/paciente.service'
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-modal-pacientes',
  templateUrl: './modal-pacientes.component.html'
})
export class ModalPacientesComponent implements OnInit {


  formularioPaciente: FormGroup;
  executandoRequisicao: boolean;
  acaoModal: string;
  paciente: any;


  constructor(
    public dialogRef: MatDialogRef<ModalPacientesComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private pacienteService: PacienteService
  ) {
    this.acaoModal = data.acao;
  }

  ngOnInit() {
    this.inicializaFormulario();
  }
  async inicializaFormulario() {
    //Requisiçao das informações da empresa, configurando em seguida o formulário com os valores, ativando ou não o disable de acordo com a ação do modal
    this.pacienteService.lerPaciente(this.data.id).subscribe(response => {
      this.paciente = response;
      this.formularioPaciente = this.formBuilder.group({
        codigo: [this.paciente.codPaciente, Validators.required],
        nome: [{
          value: this.paciente.nome,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }, Validators.required],
        rg: [{
          value: this.paciente.rg,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
        cpf: [{
          value: this.paciente.cpf,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
        sexo: [{
          value: this.paciente.sexo,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
        dataNascimento: [{
          value: this.paciente.nascimento,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
      })
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  toggleMode(novaAcao) {
    //Altera a view entre visualização e edição
    this.acaoModal = novaAcao;
    switch (this.acaoModal) {
      case 'VISUALIZAR':
        for (let control in this.formularioPaciente.controls) {
          this.formularioPaciente.get(control).disable();
        }
        break;
      case 'EDITAR':
        for (let control in this.formularioPaciente.controls) {
          this.formularioPaciente.get(control).enable();
        }
        break;
    }
  }
  async deletarEmpresa() {
    await this.pacienteService.deletarPaciente(this.data.id)
      .subscribe(response => {
        this.openSnackBar("Exclusão efetuada!", 1);
        this.onNoClick();

      },
        (err: HttpErrorResponse) => {
          this.openSnackBar("Erro! Exclusão não realizada.", 0);
        });
  }

  async editarPaciente() {
    let form = this.formularioPaciente.value;
    //Testar se algum campo está vazio
    for (let campo in form) {
      if (form[campo] == null) return;
    }

    if (this.formularioPaciente.invalid) {
      this._snackBar.open("Algum dado do paciente está incorreto", null, {
        duration: 2000,
      });;
      this.executandoRequisicao = false;
      return;
    }

    //Exibe a barra de progresso
    this.executandoRequisicao = true;

    //Armazenando a resposta para dar feedback ao usuário
    await this.pacienteService.atualizarPaciente(form)
      .subscribe(response => {

        this.openSnackBar("Atualização efetuada!", 1);

        this.toggleMode('VISUALIZAR');

      }, (err: HttpErrorResponse) => {
        this.openSnackBar("Não foi possível editar!", 1);
      });
    this.inicializaFormulario();
    this.executandoRequisicao = false;
  }

  openSnackBar(mensagem, nivel) {
    //Feedback visual na forma de um alerta do tipo SnackBar
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
