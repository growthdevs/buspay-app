/** Modelos portados de `src/app/core/{models,responses,requests}` do app Ionic/Angular. */

import type {
  BeneficioTipoEnum,
  ContaBloqueioTipoEnum,
  NotificacaoTipoEnum,
  SexoEnum,
  SituacaoNotificacaoEnum,
  SolicitacaoBeneficioStatusEnum,
  StatusSolicitacaoAtivacaoVtEnum,
  TipoCartaoEnum,
  TipoDocumentoEnum,
} from "./enums";

export interface Bilhetadora {
  id: number;
  nome: string;
  codigo?: string;
}

export interface Estado {
  id?: number;
  nome: string;
  sigla: string;
}

export interface Cidade {
  id?: number;
  nome: string;
  iss?: number;
  estadoId?: number;
  estado?: Estado;
}

export interface EnderecoUsuario {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  ibgeId: number;
  complemento?: string;
}

export interface ContaBloqueio {
  contaBloqueioTipoId?: ContaBloqueioTipoEnum;
  bloqueado?: boolean;
  bilhetadora: Bilhetadora;
  dataBloqueio?: string;
  motivo?: string;
}

export interface Documento {
  ativo?: boolean;
  contentType?: string;
  dataCriacao?: string;
  extensaoArquivo?: string;
  id?: number;
  informacaoDocumento?: number;
  metrica?: string;
  nome?: string;
  regraBeneficioId?: number;
  tipoDocumento?: TipoDocumentoEnum;
  url?: string;
  tipoDocumentoNovo?: number;
}

export interface ContaBeneficiarioAcompanhante {
  contaBeneficiarioId: number;
  nomeBeneficiario: string;
  dataValidadeBeneficio: string;
  dataInclusaoBeneficio: string;
}

export interface Usuario {
  id: number;
  nome: string;
  nomeSocial?: string;
  cpf: string;
  celular: string;
  celularConfirmado: boolean;
  email: string;
  firebaseToken: string;
  imei: string;
  origemContaId: number;
  ativo: boolean;
  aceiteTermosDeUsoBuspay?: boolean;
  senha: string;
  cadastroConcluido: boolean;
  documentos: Documento[];
  dataNascimento: string;
  contaBloqueios: ContaBloqueio[];
  bilhetadoraId: number;
  appAvaliado: boolean;
  enderecos: EnderecoUsuario[];
  contasBeneficiariosAcompanhante: ContaBeneficiarioAcompanhante[];
  sexo?: SexoEnum;
  acompanhantes: Acompanhante[];
  solicitarDuplaValidacao: boolean;
  possuiDependente: boolean;
  nis?: string;
  possuiBeneficioExpiradoSemCiencia?: boolean;
  possuiPcdComoAcompanhante: boolean;
  fotoPerfilUrl?: string;
}

export interface Acompanhante {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento?: string;
}

export interface Carteira {
  id: number;
  enumTipoCarteiraExtratoApp: number;
  descricao?: string;
  saldo: number;
  valor: number;
  descricaoExtrato: string;
  bilhetadoraId: number;
  ativo?: boolean;
  solicitacaoAtivacaoVTId?: number;
  exibindoValorMaximoVT?: boolean;
  mostrarDetalheAtivacaoVT?: boolean;
  solicitarAtivacaoVTDescricao?: string;
  solicitacaoAtivacaoVTDataLimiteDescricao?: string;
  ocultarSaldoVT?: boolean;
}

export interface CarteiraDependente {
  carteiras: Carteira[];
  contaId: number;
  nome: string;
}

export interface SaldosPorBilhetadora {
  bilhetadoraId: number;
  saldoComum: number;
  saldoEstudante: number;
  saldoValeTransporte: number;
}

export interface Extrato {
  id: number;
  data: string;
  dataTransacao?: string;
  descricao: string;
  valor: number;
  tipoTransacao: number;
  carteiraTipo: number;
  bilhetadoraId?: number;
  nomeBilhetadora?: string;
  saldoAnterior?: number;
  saldoPosterior?: number;
  linha?: string;
  veiculo?: string;
  operadora?: string;
  formaPagamento?: string;
  localizacao?: string;
  tarifa?: number;
  desconto?: number;
  processoTipo?: number;
}

export interface GetExtratoResponse {
  saldoTotal: number;
  carteiras: Carteira[];
  extrato: Extrato[];
}

export interface Tarifa {
  id: number;
  dataCriacao: string;
  ativo: boolean;
  codigoTarifa: string;
  bilhetadoraId: number;
  valorBuspay: number;
  valorPublico: number;
  valorVT: number;
  valorDinheiro: number;
  descricao: string;
  observacao: string;
  dataInicioVigencia: string;
}

export interface RecargaMinima {
  id: number;
  dataCriacao: string;
  responsavelCriacao: number;
  tipoOrigemId: number;
  tipoOrigemDescricao: string;
  formaTipoPagamentoId: number;
  formaTipoPagamentoDescricao: string;
  valor: number;
}

export interface PracaFormaPagamento {
  id: number;
  formaPagamentoTipoId: number;
  descricao: string;
  ativo: boolean;
}

export interface Praca {
  id: number;
  codigo: string;
  cidade: Cidade;
  bilhetadora: Bilhetadora;
  pracaFormaPagamento: PracaFormaPagamento[];
  recargaMinimas: RecargaMinima[];
}

export interface CategoriaAjuda {
  id: number;
  codigo: number;
  descricao: string;
}

export interface SubCategoriaAjuda {
  id: number;
  codigo: number;
  descricao: string;
  categoriaId: number;
  categoria: CategoriaAjuda;
}

export interface AjudaItem {
  pageSize?: number;
  id: number;
  titulo: string;
  texto: string;
  ajudaSubCategoriaId: number;
  subCategoria: SubCategoriaAjuda;
  ativo: boolean;
  campoPesquisa: string;
}

export interface Cid {
  id: number;
  codigo: string;
  nome: string;
  direitoAcompanhante: number;
  codigoENome?: string;
}

export interface Instituicao {
  id: number;
  nome: string;
  endereco?: {
    id: number;
    cidadeId: number;
    logradouro: string;
    numero: string;
    bairro: string;
    cep: string;
    cidade: Cidade;
  };
}

export interface RegraBeneficiosDocumento {
  id: number;
  obrigatorio: boolean;
  enumTipoDocumentoNovo: TipoDocumentoEnum;
  nomeTipoDocumento: string;
  documentoIdentificacao: boolean;
  bilhetadoraTipoDocumentoId: number;
  outrosNomeDocumento?: string;
}

export interface RegraBeneficio {
  id: number;
  ativo: boolean;
  nome: string;
  descricaoBeneficio: string;
  nomeLei: string;
  descricaoLei: string;
  limiteUso: number;
  tipoUso: number;
  tipoDesconto: number;
  valorUso: number;
  valorDesconto: number;
  descontoBilhetagem: boolean;
  temConcedente: boolean;
  todasLinhas: boolean;
  todosPeriodos: boolean;
  porLinha: boolean;
  semExpiracao: boolean;
  bilhetadoraId: number;
  bilhetadora?: Bilhetadora;
  beneficioTipoId: BeneficioTipoEnum;
  temIntegracao: boolean;
  temInstituicao: boolean;
  todasIdades: boolean;
  distanciaMinima: boolean;
  disponivelApp: boolean;
  precisaDocumentacao: boolean;
  qtdKm: number;
  qtdUtilizacao: number;
  textoInformativo?: string;
  regraBeneficiosDocumentos: RegraBeneficiosDocumento[];
  tipoLinhaServicoId: number;
  renovavel?: { tipoDocumentosRenovacao: RegraBeneficiosDocumento[] };
  idadeMin?: number;
  idadeMax?: number;
}

export interface AtribuicaoBeneficioLinhaPeriodicidade {
  ativo: boolean;
  considerarFeriado: boolean;
  diaDaSemana: number;
  horarioFinal: string;
  horarioInicial: string;
  id: number;
  linhaId: number;
}

export interface AtribuicaoBeneficio {
  ativo: boolean;
  bloqueado: boolean;
  justificativa: string;
  periodicidades: AtribuicaoBeneficioLinhaPeriodicidade[];
  cid?: Cid;
  cidCrm: string;
  dataAtivacao: string;
  dataValidade: string;
  dataValidadeOriginal: string;
  direitoAcompanhante?: number;
  id: number;
  regraBeneficio: RegraBeneficio;
  instituicao?: Instituicao;
  recessoEscolar?: {
    dataInicioVigencia: string;
    dataFimVigencia: string;
    bilhetadoraId: number;
    operadoraId: number;
    regraBeneficioId: number;
    anoSeletivo: number;
    descricao: string;
  };
}

export interface SolicitacaoBeneficio {
  id: number;
  contaId: number;
  regraBeneficio: RegraBeneficio;
  statusSolicitacao: SolicitacaoBeneficioStatusEnum;
  ativo: boolean;
  motivoReprovacao?: string;
  pendenteRenovacao?: boolean;
  nomeRegraBeneficio?: string;
  statusSolicitacaoTexto?: string;
  atribuicaoBeneficio?: AtribuicaoBeneficio | null;
  ultimaSolicitacaoRenovacao?: SolicitacaoBeneficio | null;
  dataSolicitacao?: string;
  informacoesRenovacao?: {
    nomeRegraBeneficio: string;
    statusSolicitacao: SolicitacaoBeneficioStatusEnum;
  };
}

export interface BeneficioExpiradoSemCiencia {
  id: number;
  ativo: boolean;
  dataAtivacao?: string;
  dataValidade?: string;
  dataValidadeOriginal?: string;
  bloqueado?: boolean;
  cidCrm?: string;
  regraBeneficio: RegraBeneficio;
  instituicao?: Instituicao;
  cid?: Cid;
}

export interface SolicitacaoAtivacaoVT {
  id: number;
  carteiraId: number;
  dataCriacao: string;
  status: StatusSolicitacaoAtivacaoVtEnum;
  tipoDocumento: number;
  dataAprovacao?: string;
  dataReprovacao?: string;
  motivoReprovacao?: string;
}

export interface Linha {
  id: number;
  nome: string;
  codigo: string;
  codigoPublico: string;
  operadoraId: number;
  codigoENome: string;
}

export interface Onibus {
  id: number;
  prefixo: string;
  linhaId: number;
  latitude: number;
  longitude: number;
  sentido: number;
  velocidade?: number;
  atualizadoEm?: string;
  distancia?: number;
  previsaoChegada?: string;
}

export interface Loja {
  nomeFantasia: string;
  logradouro: string;
  enderecoNumero: string;
  bairro: string;
  cep: string;
  complemento: string;
  cidade: string;
  distancia: number;
  telefone: string;
  celular: string;
  latitudeLoja: number;
  longitudeLoja: number;
}

export interface Notificacao {
  contaId?: number;
  dataHoraCriacao?: string;
  dataHoraEnvio?: string;
  dataHoraRecebimento?: string;
  dataHoraVisualizacao?: string;
  titulo?: string;
  mensagem?: string;
  situacao?: SituacaoNotificacaoEnum;
  tipo?: NotificacaoTipoEnum;
  firebaseToken?: string;
  topico?: string;
}

export interface NotificacoesRetorno {
  quantidadeNaoVisualizadas?: number;
  listaNotificacoesUltimos7Dias: Notificacao[];
  listaNotificacoesDemaisDias: Notificacao[];
}

export interface ContratoAdesaoApp {
  id: number;
  contratoAdesaoAppTipoId: number;
  descricaoTipo: string;
  dataAtivacao: string;
}

export interface BandeiraCartao {
  tipo: TipoCartaoEnum;
  nome: string;
}

export interface PaginationResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalItemCount: number;
  itens: T[];
}
