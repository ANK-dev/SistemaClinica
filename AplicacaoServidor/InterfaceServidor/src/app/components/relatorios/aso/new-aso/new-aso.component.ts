import { Component, OnInit, Input, Inject,NgZone,ViewChild ,ElementRef} from '@angular/core';
import { ConsultasService } from '../../../../services/consulta/consultas.service'
import { EmpresasService } from '../../../../services/empresas/empresas.service'
import { PacienteService } from 'src/app/services/paciente/paciente.service';
import { EmpresaPacienteFuncaoService } from '../../../../services/empresa_paciente_funcao/empresa-paciente-funcao.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoConsultaService } from 'src/app/services/tipoconsulta/tipo-consulta.service';
import { RiscoService } from 'src/app/services/risco/risco.service';
import { ExameService } from 'src/app/services/exame/exame.service';
import { ConsultaExameProfissionalService } from 'src/app/services/consulta-exame-profissional/consultas-exame-profissional.service';
import { ParecerService } from 'src/app/services/parecer/parecer.service';
import { ExameRiscoService } from 'src/app/services/exame_risco/exame-risco.service';
import { CategoriaRiscoService } from 'src/app/services/categoria-risco/categoria-risco.service';
//import * as jsPDF from 'jspdf'
//import html2canvas from 'html2canvas';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConsultaParecerService } from '../../../../services/consulta_parecer/consulta-parecer.service';
import { ElectronService } from 'ngx-electron';
@Component({
  selector: 'app-new-aso',
  templateUrl: './new-aso.component.html',
  styleUrls: ['./new-aso.component.css']
})
export class NewAsoComponent implements OnInit {

  executandoRequisicao = false;
  message: string;
  @ViewChild('content',{static:false}) content:ElementRef;

  constructor(
    public dialogRef: MatDialogRef<NewAsoComponent>,
    private consultaService: ConsultasService,
    private empresaService: EmpresasService,
    private pacienteService: PacienteService,
    private empresaPacienteFuncao: EmpresaPacienteFuncaoService,
    private formBuilder: FormBuilder,
    private tipoConsultaService: TipoConsultaService,
    private riscosExameService: ExameRiscoService,
    private exameService: ExameService,
    private exameConsultaProfissionalService: ConsultaExameProfissionalService,
    private parecerService: ParecerService,
    private categoriaRiscoService: CategoriaRiscoService,
    private consultaParecerService: ConsultaParecerService,
    private _electronService: ElectronService, 
    private _ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { 
    this._electronService.ipcRenderer.on('asynchronous-reply', (event, arg) => {
      this._ngZone.run(() => {
          let reply = `Asynchronous message reply: ${arg}`;
          this.message = reply;
      });
  })}

  ngOnInit() {
    this.visualizar(this.codConsulta);    
  }

  empresa;
  paciente;
  Funcao;
  consulta;
  dadosPaciente: FormGroup;
  outros: FormGroup;
  tipoconsulta = []
  codConsulta = this.data.codConsulta;
  riscos = []
  exames = []
  examesConsulta = []
  pareceres = []
  categoriaRisco = []

  iniciaDados() {
    this.dadosPaciente = this.formBuilder.group({
      cargo: [null],
      setor: [null]
    })
    this.outros = this.formBuilder.group({
      outros: [null]
    })
  }
  onNoClick() {
    this.dialogRef.close();
  }
  visualizar(codConsulta) {
    this.iniciaDados();
    this.listTipoConsulta();
    this.listExames();
    this.listParecer();
    this.listRiscos();
    this.listCatRisco();
    this.consultaService.lerConsulta(codConsulta).subscribe(consulta => {
      if (consulta) {
        this.consulta = consulta;
        this.readEmpresa(this.consulta.empresa);
        this.readPaciente(this.consulta.paciente);
        this.readExameConsulta(this.consulta.codConsulta);
        this.readParecerConsulta(this.consulta.codConsulta);
      }
    })
  }
  async readEmpresa(codEmpresa) {
    await this.empresaService.lerEmpresa(codEmpresa).subscribe(empresa => {
      this.empresa = empresa;
    })
  }
  async readPaciente(codPaciente) {
    await this.pacienteService.lerPaciente(codPaciente).subscribe(paciente => {
      this.paciente = paciente;
    })
  }
  async readExameConsulta(codConsulta) {
    this.examesConsulta = []
    await this.exameConsultaProfissionalService.lerConsultas(codConsulta).subscribe(exames => {
      let consultaObj = exames[codConsulta].cep;
      for (let i = 0; i < Object.keys(consultaObj).length; i++) {
        this.refatorateConsultaExames(consultaObj[i].codExame);
        this.refatorateRiscos(consultaObj[i].codExame);
      }
    })
  }
  async readParecerConsulta(codConsulta) {
    this.consultaParecerService.readConsultaParecer(codConsulta).subscribe(pareceres => {
      pareceres.forEach(parecer => {
        this.refatorateConsultaParecer(parecer.codParecer);
      });
    })
  }
  refatorateConsultaParecer(codParecer) {
    this.pareceres.forEach(parecer => {
      if (parecer.codParecer == codParecer) {
        parecer['selected'] = true
      }
    })
  }
  refatorateConsultaExames(codExame) {
    this.exames.forEach(data => {
      if (codExame == data.codExame) {
        data['dataHora'] = this.consulta.dataHora
      }
    })
  }
  refatorateRiscos(codExame) {
    this.riscos.map(risco => {
      if (risco.codExame == codExame) {
        risco['selected'] = true
      }
    })
  }
  async listTipoConsulta() {
    this.tipoconsulta = []
    await this.tipoConsultaService.listaDeTipoConsultas().subscribe(list => {
      list.forEach(tp => {
        this.tipoconsulta.push(tp);
      })
    })
  }
  async listRiscos() {
    this.riscos = []
    await this.riscosExameService.listaDeRiscos().subscribe(riscos => {
      riscos.forEach(risco => {
        risco['selected'] = false;
        this.riscos.push(risco);
      })
    })

  }
  async listCatRisco() {
    this.categoriaRisco = []
    await this.categoriaRiscoService.listaCategoriaRisco().subscribe(catRisco => {
      catRisco.forEach(ct => {
        this.categoriaRisco.push(ct);
      })
    })
  }
  async listExames() {
    this.exames = []
    await this.exameService.listaDeExames().subscribe(exames => {
      exames.forEach(exame => {
        exame['dataHora'] = null;
        this.exames.push(exame);
      })
    })
  }
  async listParecer() {
    await this.parecerService.listaParecer().subscribe(pareceres => {
      pareceres.forEach(parecer => {
        parecer["selected"] = false;
        this.pareceres.push(parecer)
      })
    })
  }
  
  gerarPdf(){
    this._electronService.ipcRenderer.send("printPDF",this.content.nativeElement.innerHTML);
  }
}
