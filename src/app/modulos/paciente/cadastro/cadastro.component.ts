import { Component, OnInit, ViewChild } from '@angular/core';
import { PacienteModel } from './../models/paciente.model';
import { EnderecoModel } from '../models/endereco.model';
import { CadastroService } from './cadastro.service';
import { DadosClinicosModel } from '../models/dados-clinicos.model';
import { MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-cadastro',
    templateUrl: './cadastro.component.html',
    styleUrls: ['cadastro.scss']
})
export class CadastroComponent implements OnInit {

    paciente: PacienteModel;
    retorno: any;
    postRetorno: any;
    flagMedicamento: boolean;
    @ViewChild('cadastroForm') cadastroForm : NgForm;

    constructor(private cadastroService: CadastroService,public snackBar: MatSnackBar) { }

    ngOnInit() {
        this.paciente = new PacienteModel();
        this.paciente.endereco = new EnderecoModel();
        this.paciente.dadosClinicos = new DadosClinicosModel();
    }

    salvarDados() {
        this.cadastroService.salvarPaciente(this.paciente).subscribe(resposta => {
            this.postRetorno = resposta;
            this.cadastroForm.resetForm();
        });
        this.snackBar.open('Paciente Salvo com Sucesso!',' :D', {
            duration: 5000,
          });
    }
    verificarCep() {
        if (this.paciente.endereco.cep !== undefined) {
            if (this.paciente.endereco.cep.includes('-')) {
                const cepV = /\-/gi;
                this.paciente.endereco.cep = this.paciente.endereco.cep.replace(cepV, '');
            }
            if (this.paciente.endereco.cep.length > 7) {
                this.cadastroService
                    .getCep(this.paciente.endereco.cep)
                    .subscribe((endereco) => {
                        this.paciente.endereco = endereco;
                    });
            }
        }
    }
    verificarCpf() {
        }
    verificaFlags(flag) {
        switch (flag.id) {
            case 'flagMedicamentoSim':
                this.paciente.dadosClinicos.flagMedicamento = 'S';
                break;
            case 'flagMedicamentoNao':
                this.paciente.dadosClinicos.flagMedicamento = 'N';
                break;
            case 'flagProblemaSim':
                this.paciente.dadosClinicos.flagProblemaSaude = 'S';
                break;
            case 'flagProblemaNao':
                this.paciente.dadosClinicos.flagProblemaSaude = 'N';
                break;
            case 'flagPressaoSim':
                this.paciente.dadosClinicos.flagPressao = 'S';
                break;
            case 'flagPressaoNao':
                this.paciente.dadosClinicos.flagPressao = 'N';
                break;
            case 'flagSensibilidadeSim':
                this.paciente.dadosClinicos.flagSensibilidade = 'S';
                break;
            case 'flagSensibilidadeNao':
                this.paciente.dadosClinicos.flagSensibilidade = 'N';
                break;
            case 'flagMasculino':
                this.paciente.sexo = 'M';
                break;
            case 'flagFeminino':
                this.paciente.sexo = 'F';
                break;
        }
    }
}
