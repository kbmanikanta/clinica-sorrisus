import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { PesquisaService } from './pesquisa.service';
import { PacienteModel } from '../models/paciente.model';
import { PacienteComponent } from '../paciente.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CadastroService } from '../cadastro/cadastro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.component.html',
  styles: ['./../cadastro/cadastro.scss']
})
export class PesquisaComponent implements OnInit {

  elementos: PacienteModel[] = [];
  pacienteAtualizacao: PacienteModel;
  dataSource: any;
  arrayTemp: PacienteModel[] = [];
  visualizarSideBar: boolean;
  displayedColumns = ['id', 'nome', 'profissao'];
  paciente: PacienteModel = new PacienteModel();
  situacaoCpf: any;
  constructor(private pesquisaService: PesquisaService,
    public snackBar: MatSnackBar,
    private cadastroService: CadastroService,
    private router: Router) {
    this.pacienteAtualizacao = new PacienteModel();
  }
  ngOnInit() {
    this.getUsuarios();
  }

  private getUsuarios(): void {
    this.arrayTemp = [];
    this.pesquisaService.getUsuarios().subscribe((usuarios: PacienteModel[]) => {
      this.elementos = usuarios;

      usuarios.map((elemento) => {
        const paciente = new PacienteModel();
        paciente.id = elemento.id;
        paciente.nomeCompleto = elemento.nomeCompleto;
        paciente.profissao = elemento.profissao;
        this.arrayTemp.push(paciente);
      });
      this.dataSource = new MatTableDataSource(this.arrayTemp);
    });
  }

  linhaSelecionada(linhaSelecionada: PacienteModel) {
    this.pacienteAtualizacao = this.elementos.find((paciente) => paciente.id === linhaSelecionada.id);
    this.visualizarSideBar = true;
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // Valida se o CPF está correto
  validarCpf(cpf: string) {
    let soma = 0;
    let resto;

    if (cpf === '') {
      this.situacaoCpf = false;
      return false;
    } else {
      // deixa apenas os numeros
      cpf.replace(/[^0-9]+/g, '');
    }

    // Primeiro digito
    if (cpf === '00000000000' || cpf === '11111111111' || cpf === '22222222222' || cpf == '33333333333' ||
      cpf === '44444444444' || cpf === '55555555555' ||
      cpf === '66666666666' || cpf === '77777777777' ||
      cpf === '88888888888' || cpf === '99999999999') {

      this.situacaoCpf = false;
      return false;

    }
    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
      resto = (soma * 10) % 11;
    }

    if ((resto === 10) || (resto === 11)) {
      resto = 0;

    }
    if (resto !== parseInt(cpf.substring(9, 10))) {

      this.situacaoCpf = false;
      return false;
    }

    // Segundo digito
    soma = 0;

    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
      resto = 0;
      this.situacaoCpf = true;
    }
    if (resto !== parseInt(cpf.substring(10, 11))) {
      this.situacaoCpf = false;
      return false;
    }

    this.situacaoCpf = true;
    return true;
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
  atualizarPacientes() {
    this.pesquisaService.updateUsuarios(this.paciente.id, this.paciente).subscribe((paciente) => {
      this.snackBar.open('Paciente Atualizado com Sucesso!', ' :D', {
        duration: 5000,
      });
      this.visualizarSideBar = false;
      this.getUsuarios();
    });

  }
  deletarPacientes() {
    this.pesquisaService.deleteUsuarios(this.paciente.id).subscribe((paciente) => {
      this.snackBar.open('Paciente Deletado com Sucesso!', ' :D', {
        duration: 5000,
      });
      this.visualizarSideBar = false;
      this.getUsuarios();
    });

  }
}

