export type FaseSessao =
  | 'inicio'
  | 'respiracao'
  | 'retencao'
  | 'recuperacao'
  | 'finalizada';

export interface EstadoSessao {
  fase: FaseSessao;
  respiracaoAtual: number;
  totalRespiracoes: number;
  tempoRetencao: number;
  pausada: boolean;
}

export interface ConfiguracaoSessao {
  numeroRespiracoes: number;
  tempoRecuperacao: number;
  somAtivado: boolean;
}

export interface ResultadoSessao {
  tempoRetencao: number;
  dataHora: Date;
}
