import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { EmpresasService } from '../../../services/empresas/empresas.service';

@Component({
  selector: 'app-modal-empresa',
  templateUrl: './modal-empresa.component.html'
})
export class ModalEmpresaComponent implements OnInit {

  formularioEmpresa: FormGroup;
  executandoRequisicao: boolean;
  acaoModal: string;
  empresa: any;

  constructor(
    public dialogRef: MatDialogRef<ModalEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private empresaService: EmpresasService,
    private _snackBar: MatSnackBar
  ) {
    this.acaoModal = data.acao;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.inicializaFormulario();
  }

  async inicializaFormulario() {
    //Requisiçao das informações da empresa, configurando em seguida o formulário com os valores, ativando ou não o disable de acordo com a ação do modal
    this.empresaService.lerEmpresa(this.data.id).subscribe(response => {
      this.empresa = response;
      this.formularioEmpresa = this.formBuilder.group({
        codigo: [this.empresa.codEmpresa],
        nome: [{
          value: this.empresa.nome,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }, Validators.required],
        cnpj: [{
          value: this.empresa.cnpj,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
        telefone1: [{
          value: this.empresa.telefone1,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
        telefone2: [{
          value: this.empresa.telefone2,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
        tipoPgto: [{
          value: this.empresa.tipoPgto,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
        rua: [{
          value: this.empresa.rua,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
        numero: [{
          value: this.empresa.numero,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
        bairro: [{
          value: this.empresa.bairro,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
        cidade: [{
          value: this.empresa.cidade,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
        cep: [{
          value: this.empresa.cep,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }],
        estado: [{
          value: this.empresa.estado,
          disabled: this.acaoModal == 'EDITAR' ? false : true
        }]
      });
    });
  }

  toggleMode(novaAcao) {
    //Altera a view entre visualização e edição
    this.acaoModal = novaAcao;
    switch (this.acaoModal) {
      case 'VISUALIZAR':
        for (let control in this.formularioEmpresa.controls) {
          this.formularioEmpresa.get(control).disable();
        }
        break;
      case 'EDITAR':
        for (let control in this.formularioEmpresa.controls) {
          this.formularioEmpresa.get(control).enable();
        }
        break;
    }
  }

  async deletarEmpresa() {
    await this.empresaService.deletarEmpresa(this.data.id)
      .subscribe(response => {
        this.openSnackBar("Exclusão efetuada!", 1);
        this.onNoClick();

      }, (err: HttpErrorResponse) => {
        this._snackBar.open("Não foi possível deletar a consulta!", null, {
          duration: 2000,
        })
      });
  }

  async editarEmpresa() {
    let form = this.formularioEmpresa.value;
    //Testar se algum campo está vazio
    for (let campo in form) {
      if (form[campo] == null) return;
    }
    //Exibe a barra de progresso
    this.executandoRequisicao = true;

    if (this.formularioEmpresa.invalid) {
      this._snackBar.open("Algum dado da empresa está incorreto", null, {
        duration: 2000,
      });;
      this.executandoRequisicao = false;
      return;
    }

    //Armazenando a resposta para dar feedback ao usuário
    await this.empresaService.atualizarEmpresa(form)
      .subscribe(response => {

        this.openSnackBar("Atualização efetuada!", 1);
        this.inicializaFormulario();
        this.toggleMode('VISUALIZAR');
      },
        (err: HttpErrorResponse) => {
          this._snackBar.open("Não foi possível alterar dados!", null, {
            duration: 2000,
          })
        });
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
