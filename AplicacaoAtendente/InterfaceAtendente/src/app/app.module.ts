import "../polyfills";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MatSidenavModule,MatListModule,MatTableModule,MatPaginatorModule,MatSortModule,MatFormFieldModule,MatInputModule,MatPaginatorIntl,MatButtonModule,MatSelectModule,MatGridListModule,MatProgressBarModule,MatSnackBarModule,MatDialogModule,MatExpansionModule,} from "@angular/material";
import { MatStepperModule } from '@angular/material/stepper';
import { Interceptor } from './services/header.interceptor'
import { getPortuguesePaginatorIntl } from "./portuguese-paginator-initl";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatRadioModule } from "@angular/material/radio";
import { MatTooltipModule } from '@angular/material';

//------------------------------- Componentes ------------------------------------

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { InicioComponent } from "./components/inicio/inicio.component";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { EmpresasComponent } from "./components/empresas/empresas.component";
import { AgendadosComponent } from "./components/agendados/agendados.component";
import { PreAgendamento } from "./components/preagendar/preagendar.component";
import { FuncoesComponent } from "./components/funcoes/funcoes.component";
import { AtividadesComponent } from "./components/atividades/atividades.component";
import { ExamesComponent } from "./components/exames/exames.component";
import { PacientesComponent } from "./components/pacientes/pacientes.component";
import { SubgruposComponent } from "./components/subgrupos/subgrupos.component";
import { ProfissionaisComponent } from "./components/profissionais/profissionais.component";

//------------------------------- serviços ------------------------------------

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { EmpresasService } from "./services/empresas/empresas.service";
import { FuncaoService } from "./services/funcao/funcao.service";
import { SubgrupoService } from "./services/subgrupo/subgrupo.service";
import { PacienteService } from "./services/paciente/paciente.service";
import { ExameService } from "./services/exames/exames.service";
import { AtividadeService } from "./services/atividade/atividade.service";
import { profissionalService } from "./services/profissional/profissional.service";
import { EstadosService } from "./services/estado/estado.service";
import { RiscosService } from './services/risco/riscos.service';
import { CategoriaRiscoService } from "./services/categoria_risco/categoria-risco.service";
import { SocketService } from './services/socket/socket.service'

//------------------------------- Modal (visualização) ------------------------------------

import { ModalFuncoesComponent } from "./components/funcoes/modal-funcoes/modal-funcoes.component";
import { NovaFuncaoComponent } from "./components/funcoes/nova-funcao/nova-funcao.component";
import { ModalExamesComponent } from "./components/exames/modal-exames/modal-exames.component";
import { NovoExameComponent } from "./components/exames/novo-exame/novo-exame.component";
import { ModalEmpresaComponent } from "./components/empresas/modal-empresa/modal-empresa.component";
import { NovaEmpresaComponent } from "./components/empresas/nova-empresa/nova-empresa.component";
import { ModalAtividadesComponent } from "./components/atividades/modal-atividades/modal-atividades.component";
import { NovaAtividadeComponent } from "./components/atividades/nova-atividade/nova-atividade.component";
import { ModalSubgruposComponent } from "./components/subgrupos/modal-subgrupos/modal-subgrupos.component";
import { NovoSubgrupoComponent } from "./components/subgrupos/novo-subgrupo/novo-subgrupo.component";
import { ModalPacientesComponent } from "./components/pacientes/modal-pacientes/modal-pacientes.component";
import { NovoPacienteComponent } from "./components/pacientes/novo-paciente/novo-paciente.component";
import { NovaEmpresaRapidaComponent } from "./components/preagendar/nova-empresa-rapida/nova-empresa-rapida.component";
import { NovoPacienteRapidoComponent } from "./components/preagendar/novo-paciente-rapido/novo-paciente-rapido.componente";
import { RiscosComponent } from './components/riscos/riscos.component';
import { NovoRiscoComponent } from './components/riscos/novo-risco/novo-risco.component';
import { ModalRiscoComponent } from './components/riscos/modal-risco/modal-risco.component';
import { ParecerComponent } from './components/parecer/parecer.component';
import { NovoParecerComponent } from './components/parecer/novo-parecer/novo-parecer.component';
import { ModalParecerComponent } from './components/parecer/modal-parecer/modal-parecer.component';
import { SalasComponent } from './components/salas/salas.component';
import { NovaSalaComponent } from './components/salas/nova-sala/nova-sala.component';
import { ModalSalaComponent } from './components/salas/modal-sala/modal-sala.component';
import { ModalCatalogoComponentInicio } from './components/inicio/modal-catalogo/modal-catalogo.component';
import { ModalProfissionalComponent } from './components/profissionais/modal-profissionais/modal-profissionais.component';
import { ModalCEPComponent } from './components/modal-cep/modal-cep.component';
import { StorageServiceModule } from "ngx-webstorage-service";
import { ModalCatalogoComponentAgendados } from './components/agendados/modal-catalogo/modal-catalogo.component';
import { ModalEstadosAgendadosComponent } from './components/agendados/modal-estados-agendados/modal-estados-agendados.component'
import { ModalEstadosInicioComponent } from './components/inicio/modal-estados-inicio/modal-estados-inicio.component';
import { TelainicioComponent } from './components/telainicio/telainicio.component'

@NgModule({
    declarations: [
        AppComponent,
        InicioComponent,
        SidenavComponent,
        EmpresasComponent,
        AgendadosComponent,
        PreAgendamento,
        FuncoesComponent,
        AtividadesComponent,
        ExamesComponent,
        PacientesComponent,
        SubgruposComponent,
        ProfissionaisComponent,
        PreAgendamento,
        RiscosComponent,
        ParecerComponent,
        SalasComponent,

        ModalFuncoesComponent,
        NovaFuncaoComponent,

        ModalExamesComponent,
        NovoExameComponent,

        ModalEmpresaComponent,
        NovaEmpresaComponent,

        ModalAtividadesComponent,
        NovaAtividadeComponent,

        ModalSubgruposComponent,
        NovoSubgrupoComponent,

        ModalPacientesComponent,
        NovoPacienteComponent,

        ModalProfissionalComponent,

        NovoRiscoComponent,
        ModalRiscoComponent,

        NovoParecerComponent,
        ModalParecerComponent,

        NovaSalaComponent,
        ModalSalaComponent,

        NovaEmpresaRapidaComponent,
        NovoPacienteRapidoComponent,

        ModalCatalogoComponentInicio,
        ModalCatalogoComponentAgendados,
        ModalCEPComponent,

        ModalEstadosAgendadosComponent,
        ModalEstadosInicioComponent,
        TelainicioComponent,
    ],
    entryComponents: [
        PreAgendamento,
        NovaEmpresaRapidaComponent,
        NovoPacienteRapidoComponent,
        SidenavComponent,

        ModalFuncoesComponent,
        FuncoesComponent,
        NovaFuncaoComponent,

        ModalExamesComponent,
        ExamesComponent,
        NovoExameComponent,

        ModalEmpresaComponent,
        EmpresasComponent,
        NovaEmpresaComponent,

        ModalAtividadesComponent,
        AtividadesComponent,
        NovaAtividadeComponent,

        ModalSubgruposComponent,
        SubgruposComponent,
        NovoSubgrupoComponent,

        ModalPacientesComponent,
        PacientesComponent,
        NovoPacienteComponent,

        ProfissionaisComponent,
        ModalProfissionalComponent,

        RiscosComponent,
        ModalRiscoComponent,
        NovoRiscoComponent,

        ParecerComponent,
        ModalParecerComponent,
        NovoParecerComponent,

        SalasComponent,
        ModalSalaComponent,
        NovaSalaComponent,

        InicioComponent,
        AgendadosComponent,
        ModalCEPComponent,

        ModalCatalogoComponentInicio,
        ModalEstadosInicioComponent,

        ModalCatalogoComponentAgendados,
        ModalEstadosAgendadosComponent
    ],
    imports: [
        MatTooltipModule,
        BrowserModule,
        AppRoutingModule,
        MatSidenavModule,
        MatListModule,
        BrowserAnimationsModule,
        MatDialogModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatSidenavModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatGridListModule,
        MatProgressBarModule,
        MatExpansionModule,
        MatSnackBarModule,
        MatDialogModule,
        MatRadioModule,
        MatStepperModule,
        StorageServiceModule
    ],
    providers: [

        { provide: MatPaginatorIntl, useValue: getPortuguesePaginatorIntl() },
        EmpresasService,
        FuncaoService,
        SubgrupoService,
        PacienteService,
        ExameService,
        AtividadeService,
        EstadosService,
        profissionalService,
        PacientesComponent,
        RiscosService,
        NovoPacienteComponent,
        EmpresasComponent,
        NovaEmpresaComponent,
        NovaEmpresaRapidaComponent,
        NovoPacienteRapidoComponent,
        SidenavComponent,
        CategoriaRiscoService,
        AgendadosComponent,
        SocketService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: Interceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
