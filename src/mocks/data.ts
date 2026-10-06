/**
 * Dados mockados que substituem integralmente as chamadas de API do app
 * original. Nenhum módulo deste projeto faz requisição de rede.
 */

import {
  BeneficioTipoEnum,
  ContaBloqueioTipoEnum,
  EnumTipoCarteiraExtratoApp,
  NotificacaoTipoEnum,
  SexoEnum,
  SituacaoNotificacaoEnum,
  SolicitacaoBeneficioStatusEnum,
  StatusSolicitacaoAtivacaoVtEnum,
  TipoDocumentoEnum,
  TipoTransacaoEnum,
} from "../core/enums";
import type {
  AjudaItem,
  AtribuicaoBeneficio,
  Carteira,
  CarteiraDependente,
  Cid,
  ContratoAdesaoApp,
  Extrato,
  Instituicao,
  Linha,
  Loja,
  Notificacao,
  NotificacoesRetorno,
  Onibus,
  Praca,
  RegraBeneficio,
  SaldosPorBilhetadora,
  SolicitacaoAtivacaoVT,
  SolicitacaoBeneficio,
  Tarifa,
  Usuario,
} from "../core/models";

const hojeMenos = (dias: number) => {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString();
};

const hojeMais = (dias: number) => {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString();
};

function item<T>(arr: readonly T[], index: number): T {
  const value = arr[index];
  if (value === undefined) throw new Error(`Mock sem item no índice ${index}`);
  return value;
}

const BILHETADORA_CAMPINAS = { id: 1, nome: "Campinas", codigo: "CPS" };
const BILHETADORA_SOROCABA = { id: 2, nome: "Sorocaba", codigo: "SOR" };

export const BILHETADORAS = [BILHETADORA_CAMPINAS, BILHETADORA_SOROCABA];

export const usuarioMock: Usuario = {
  id: 10542,
  nome: "MARIA APARECIDA DOS SANTOS",
  nomeSocial: "",
  cpf: "12345678901",
  celular: "+5519998877665",
  celularConfirmado: true,
  email: "maria.santos@email.com",
  firebaseToken: "mock-firebase-token",
  imei: "mock-imei",
  origemContaId: 1,
  ativo: true,
  aceiteTermosDeUsoBuspay: true,
  senha: "",
  cadastroConcluido: true,
  dataNascimento: "1989-04-17T00:00:00",
  bilhetadoraId: 1,
  appAvaliado: false,
  sexo: SexoEnum.Feminino,
  solicitarDuplaValidacao: false,
  possuiDependente: true,
  nis: "12345678901",
  possuiBeneficioExpiradoSemCiencia: true,
  possuiPcdComoAcompanhante: false,
  fotoPerfilUrl: "",
  documentos: [
    {
      id: 1,
      ativo: true,
      nome: "selfie.jpg",
      tipoDocumento: TipoDocumentoEnum.facial,
      dataCriacao: hojeMenos(120),
      url: "/assets/images/perfil/face.png",
    },
  ],
  contaBloqueios: [
    {
      contaBloqueioTipoId: ContaBloqueioTipoEnum.SaldoInsuficiente,
      bloqueado: true,
      bilhetadora: BILHETADORA_CAMPINAS,
      dataBloqueio: hojeMenos(3),
      motivo: "Saldo insuficiente para a tarifa vigente.",
    },
  ],
  enderecos: [
    {
      id: 1,
      logradouro: "Rua das Palmeiras",
      numero: "320",
      bairro: "Centro",
      cep: "13010020",
      cidade: "Campinas",
      estado: "SP",
      ibgeId: 3509502,
      complemento: "Apto 42",
    },
  ],
  contasBeneficiariosAcompanhante: [],
  acompanhantes: [],
};

export const carteirasMock: Carteira[] = [
  {
    id: 1,
    enumTipoCarteiraExtratoApp: EnumTipoCarteiraExtratoApp.Regular,
    descricao: "Comum",
    saldo: 42.75,
    valor: 42.75,
    descricaoExtrato: "Carteira Comum",
    bilhetadoraId: 1,
    ativo: true,
    ocultarSaldoVT: false,
  },
  {
    id: 2,
    enumTipoCarteiraExtratoApp: EnumTipoCarteiraExtratoApp.VT,
    descricao: "Vale Transporte",
    saldo: 118.4,
    valor: 118.4,
    descricaoExtrato: "Vale Transporte",
    bilhetadoraId: 1,
    ativo: true,
    mostrarDetalheAtivacaoVT: false,
    ocultarSaldoVT: false,
  },
  {
    id: 3,
    enumTipoCarteiraExtratoApp: EnumTipoCarteiraExtratoApp.Estudante,
    descricao: "Estudante",
    saldo: 27.0,
    valor: 27.0,
    descricaoExtrato: "Carteira Estudante",
    bilhetadoraId: 1,
    ativo: true,
    ocultarSaldoVT: false,
  },
];

export const saldosBilhetadorasMock: SaldosPorBilhetadora[] = [
  { bilhetadoraId: 1, saldoComum: 42.75, saldoEstudante: 27.0, saldoValeTransporte: 118.4 },
];

export const dependentesMock: CarteiraDependente[] = [
  {
    contaId: 20781,
    nome: "PEDRO HENRIQUE DOS SANTOS",
    carteiras: [
      {
        id: 11,
        enumTipoCarteiraExtratoApp: EnumTipoCarteiraExtratoApp.Estudante,
        descricao: "Estudante",
        saldo: 15.5,
        valor: 15.5,
        descricaoExtrato: "Carteira Estudante",
        bilhetadoraId: 1,
        ativo: true,
      },
    ],
  },
  {
    contaId: 20782,
    nome: "ANA CLARA DOS SANTOS",
    carteiras: [
      {
        id: 12,
        enumTipoCarteiraExtratoApp: EnumTipoCarteiraExtratoApp.Regular,
        descricao: "Comum",
        saldo: 8.9,
        valor: 8.9,
        descricaoExtrato: "Carteira Comum",
        bilhetadoraId: 1,
        ativo: true,
      },
    ],
  },
];

export const dependentesSaldosMock = dependentesMock.map((d) => {
  const carteira = d.carteiras[0];
  return {
    contaId: d.contaId,
    saldoTotal: [
      {
        bilhetadoraId: 1,
        saldoComum: carteira?.enumTipoCarteiraExtratoApp === 1 ? carteira.saldo : 0,
        saldoEstudante: carteira?.enumTipoCarteiraExtratoApp === 3 ? carteira.saldo : 0,
        saldoValeTransporte: 0,
      },
    ],
  };
});

export const pracasMock: Praca[] = [
  {
    id: 1,
    codigo: "CPS",
    cidade: { id: 1, nome: "Campinas", iss: 2, estado: { id: 25, nome: "São Paulo", sigla: "SP" } },
    bilhetadora: BILHETADORA_CAMPINAS,
    pracaFormaPagamento: [
      { id: 1, formaPagamentoTipoId: 1, descricao: "Cartão de Crédito", ativo: true },
      { id: 2, formaPagamentoTipoId: 2, descricao: "Pix", ativo: true },
    ],
    recargaMinimas: [
      {
        id: 1,
        dataCriacao: hojeMenos(400),
        responsavelCriacao: 1,
        tipoOrigemId: 1,
        tipoOrigemDescricao: "App",
        formaTipoPagamentoId: 1,
        formaTipoPagamentoDescricao: "Cartão de Crédito",
        valor: 10,
      },
      {
        id: 2,
        dataCriacao: hojeMenos(400),
        responsavelCriacao: 1,
        tipoOrigemId: 1,
        tipoOrigemDescricao: "App",
        formaTipoPagamentoId: 2,
        formaTipoPagamentoDescricao: "Pix",
        valor: 5,
      },
    ],
  },
  {
    id: 2,
    codigo: "SOR",
    cidade: { id: 2, nome: "Sorocaba", iss: 2, estado: { id: 25, nome: "São Paulo", sigla: "SP" } },
    bilhetadora: BILHETADORA_SOROCABA,
    pracaFormaPagamento: [
      { id: 3, formaPagamentoTipoId: 1, descricao: "Cartão de Crédito", ativo: true },
      { id: 4, formaPagamentoTipoId: 2, descricao: "Pix", ativo: true },
    ],
    recargaMinimas: [
      {
        id: 3,
        dataCriacao: hojeMenos(400),
        responsavelCriacao: 1,
        tipoOrigemId: 1,
        tipoOrigemDescricao: "App",
        formaTipoPagamentoId: 1,
        formaTipoPagamentoDescricao: "Cartão de Crédito",
        valor: 10,
      },
    ],
  },
];

export const extratoMock: Extrato[] = [
  {
    id: 1,
    data: hojeMenos(0),
    dataTransacao: hojeMenos(0),
    descricao: "Pagamento de passagem",
    valor: 4.9,
    tipoTransacao: TipoTransacaoEnum.debito,
    processoTipo: 2,
    carteiraTipo: EnumTipoCarteiraExtratoApp.Regular,
    bilhetadoraId: 1,
    nomeBilhetadora: "Campinas",
    saldoAnterior: 47.65,
    saldoPosterior: 42.75,
    linha: "331 - Terminal Central / Barão Geraldo",
    veiculo: "12345",
    operadora: "VB Transportes",
    formaPagamento: "QR Code",
    localizacao: "Av. Francisco Glicério, 1200",
    tarifa: 4.9,
    desconto: 0,
  },
  {
    id: 2,
    data: hojeMenos(1),
    dataTransacao: hojeMenos(1),
    descricao: "Recarga via Pix",
    valor: 50,
    tipoTransacao: TipoTransacaoEnum.credito,
    processoTipo: 3,
    carteiraTipo: EnumTipoCarteiraExtratoApp.Regular,
    bilhetadoraId: 1,
    nomeBilhetadora: "Campinas",
    saldoAnterior: 0.15,
    saldoPosterior: 50.15,
    formaPagamento: "Pix",
  },
  {
    id: 3,
    data: hojeMenos(2),
    dataTransacao: hojeMenos(2),
    descricao: "Pagamento de passagem",
    valor: 4.9,
    tipoTransacao: TipoTransacaoEnum.debito,
    processoTipo: 2,
    carteiraTipo: EnumTipoCarteiraExtratoApp.VT,
    bilhetadoraId: 1,
    nomeBilhetadora: "Campinas",
    saldoAnterior: 123.3,
    saldoPosterior: 118.4,
    linha: "202 - Jardim Eulina / Centro",
    veiculo: "20781",
    operadora: "Itajaí Transportes",
    formaPagamento: "QR Code",
    tarifa: 4.9,
    desconto: 0,
  },
  {
    id: 4,
    data: hojeMenos(4),
    dataTransacao: hojeMenos(4),
    descricao: "Crédito de Vale Transporte",
    valor: 128.2,
    tipoTransacao: TipoTransacaoEnum.credito,
    processoTipo: 3,
    carteiraTipo: EnumTipoCarteiraExtratoApp.VT,
    bilhetadoraId: 1,
    nomeBilhetadora: "Campinas",
    saldoAnterior: 0,
    saldoPosterior: 128.2,
    formaPagamento: "Empregador",
  },
  {
    id: 5,
    data: hojeMenos(6),
    dataTransacao: hojeMenos(6),
    descricao: "Pagamento de passagem (Estudante)",
    valor: 2.45,
    tipoTransacao: TipoTransacaoEnum.debito,
    processoTipo: 2,
    carteiraTipo: EnumTipoCarteiraExtratoApp.Estudante,
    bilhetadoraId: 1,
    nomeBilhetadora: "Campinas",
    saldoAnterior: 29.45,
    saldoPosterior: 27.0,
    linha: "331 - Terminal Central / Barão Geraldo",
    veiculo: "12345",
    operadora: "VB Transportes",
    formaPagamento: "QR Code",
    tarifa: 4.9,
    desconto: 2.45,
  },
  {
    id: 6,
    data: hojeMenos(11),
    dataTransacao: hojeMenos(11),
    descricao: "Recarga via Cartão de Crédito",
    valor: 30,
    tipoTransacao: TipoTransacaoEnum.credito,
    processoTipo: 3,
    carteiraTipo: EnumTipoCarteiraExtratoApp.Regular,
    bilhetadoraId: 1,
    nomeBilhetadora: "Campinas",
    saldoAnterior: 5.05,
    saldoPosterior: 35.05,
    formaPagamento: "Mastercard **** 4321",
  },
  {
    id: 7,
    data: hojeMenos(21),
    dataTransacao: hojeMenos(21),
    descricao: "Pagamento de passagem",
    valor: 4.9,
    tipoTransacao: TipoTransacaoEnum.debito,
    processoTipo: 2,
    carteiraTipo: EnumTipoCarteiraExtratoApp.Regular,
    bilhetadoraId: 2,
    nomeBilhetadora: "Sorocaba",
    saldoAnterior: 9.95,
    saldoPosterior: 5.05,
    linha: "14 - Vila Haro / Centro",
    veiculo: "55012",
    operadora: "Urbes",
    formaPagamento: "QR Code",
    tarifa: 4.9,
    desconto: 0,
  },
];

const regraBeneficioBase: Omit<RegraBeneficio, "id" | "nome" | "beneficioTipoId"> = {
  ativo: true,
  descricaoBeneficio: "Benefício de gratuidade concedido conforme legislação municipal vigente.",
  nomeLei: "Lei Municipal nº 12.345/2019",
  descricaoLei:
    "Assegura a gratuidade no transporte público coletivo urbano aos beneficiários que atendam aos requisitos previstos na legislação.",
  limiteUso: 0,
  tipoUso: 1,
  tipoDesconto: 3,
  valorUso: 0,
  valorDesconto: 100,
  descontoBilhetagem: false,
  temConcedente: false,
  todasLinhas: true,
  todosPeriodos: true,
  porLinha: false,
  semExpiracao: false,
  bilhetadoraId: 1,
  bilhetadora: BILHETADORA_CAMPINAS,
  temIntegracao: true,
  temInstituicao: false,
  todasIdades: false,
  distanciaMinima: false,
  disponivelApp: true,
  precisaDocumentacao: true,
  qtdKm: 0,
  qtdUtilizacao: 2,
  tipoLinhaServicoId: 1,
  regraBeneficiosDocumentos: [
    {
      id: 1,
      obrigatorio: true,
      enumTipoDocumentoNovo: TipoDocumentoEnum.documentoIdentificacao,
      nomeTipoDocumento: "Documento de identificação com foto",
      documentoIdentificacao: true,
      bilhetadoraTipoDocumentoId: 1,
    },
    {
      id: 2,
      obrigatorio: true,
      enumTipoDocumentoNovo: TipoDocumentoEnum.comprovanteEndereco,
      nomeTipoDocumento: "Comprovante de endereço",
      documentoIdentificacao: false,
      bilhetadoraTipoDocumentoId: 2,
    },
  ],
};

export const regrasBeneficioMock: RegraBeneficio[] = [
  {
    ...regraBeneficioBase,
    id: 1,
    nome: "Estudante",
    beneficioTipoId: BeneficioTipoEnum.estudante,
    tipoDesconto: 1,
    valorDesconto: 50,
    temInstituicao: true,
    textoInformativo:
      "O benefício estudantil garante 50% de desconto na tarifa, limitado a 2 utilizações por dia letivo.",
    regraBeneficiosDocumentos: [
      ...regraBeneficioBase.regraBeneficiosDocumentos,
      {
        id: 3,
        obrigatorio: true,
        enumTipoDocumentoNovo: TipoDocumentoEnum.comprovanteMatricula,
        nomeTipoDocumento: "Comprovante de matrícula",
        documentoIdentificacao: false,
        bilhetadoraTipoDocumentoId: 3,
      },
    ],
    renovavel: {
      tipoDocumentosRenovacao: [
        {
          id: 3,
          obrigatorio: true,
          enumTipoDocumentoNovo: TipoDocumentoEnum.comprovanteMatricula,
          nomeTipoDocumento: "Comprovante de matrícula",
          documentoIdentificacao: false,
          bilhetadoraTipoDocumentoId: 3,
        },
      ],
    },
  },
  {
    ...regraBeneficioBase,
    id: 2,
    nome: "Idoso",
    beneficioTipoId: BeneficioTipoEnum.idoso,
    idadeMin: 60,
    semExpiracao: true,
    textoInformativo:
      "A gratuidade para pessoas com 60 anos ou mais é garantida mediante apresentação de documento com foto.",
  },
  {
    ...regraBeneficioBase,
    id: 3,
    nome: "PCD",
    beneficioTipoId: BeneficioTipoEnum.pcd,
    textoInformativo:
      "A gratuidade para pessoas com deficiência exige laudo médico com CID e pode incluir direito a acompanhante.",
  },
  {
    ...regraBeneficioBase,
    id: 4,
    nome: "PCD com Acompanhante",
    beneficioTipoId: BeneficioTipoEnum.pcdComAcompanhante,
    textoInformativo:
      "Modalidade destinada a quem possui direito a acompanhante registrado no laudo médico.",
  },
];

export const atribuicoesBeneficioMock: AtribuicaoBeneficio[] = [
  {
    id: 501,
    ativo: true,
    bloqueado: false,
    justificativa: "",
    periodicidades: [],
    cidCrm: "",
    dataAtivacao: hojeMenos(200),
    dataValidade: hojeMais(45),
    dataValidadeOriginal: hojeMais(45),
    regraBeneficio: item(regrasBeneficioMock, 0),
    instituicao: { id: 1, nome: "Escola Estadual Dom Pedro II" },
  },
  {
    id: 502,
    ativo: false,
    bloqueado: true,
    justificativa: "Documentação vencida",
    periodicidades: [],
    cidCrm: "",
    dataAtivacao: hojeMenos(500),
    dataValidade: hojeMenos(12),
    dataValidadeOriginal: hojeMenos(12),
    regraBeneficio: item(regrasBeneficioMock, 2),
  },
];

export const solicitacoesBeneficioMock: SolicitacaoBeneficio[] = [
  {
    id: 901,
    contaId: usuarioMock.id,
    regraBeneficio: item(regrasBeneficioMock, 0),
    statusSolicitacao: SolicitacaoBeneficioStatusEnum.aprovada,
    ativo: true,
    nomeRegraBeneficio: "Estudante",
    statusSolicitacaoTexto: "Aprovada",
    atribuicaoBeneficio: item(atribuicoesBeneficioMock, 0),
    dataSolicitacao: hojeMenos(210),
    pendenteRenovacao: true,
    ultimaSolicitacaoRenovacao: null,
  },
  {
    id: 902,
    contaId: usuarioMock.id,
    regraBeneficio: item(regrasBeneficioMock, 2),
    statusSolicitacao: SolicitacaoBeneficioStatusEnum.pendente,
    ativo: true,
    nomeRegraBeneficio: "PCD",
    statusSolicitacaoTexto: "Em análise",
    atribuicaoBeneficio: null,
    dataSolicitacao: hojeMenos(4),
    ultimaSolicitacaoRenovacao: null,
  },
  {
    id: 903,
    contaId: usuarioMock.id,
    regraBeneficio: item(regrasBeneficioMock, 1),
    statusSolicitacao: SolicitacaoBeneficioStatusEnum.reprovada,
    ativo: true,
    nomeRegraBeneficio: "Idoso",
    statusSolicitacaoTexto: "Reprovada",
    motivoReprovacao: "Documento de identificação ilegível. Reenvie uma foto nítida do documento.",
    atribuicaoBeneficio: null,
    dataSolicitacao: hojeMenos(30),
    ultimaSolicitacaoRenovacao: null,
  },
];

export const beneficiosExpiradosMock = [
  {
    id: 502,
    ativo: false,
    bloqueado: true,
    dataAtivacao: hojeMenos(500),
    dataValidade: hojeMenos(12),
    dataValidadeOriginal: hojeMenos(12),
    regraBeneficio: item(regrasBeneficioMock, 2),
  },
];

export const cidsMock: Cid[] = [
  { id: 1, codigo: "H54.0", nome: "Cegueira binocular", direitoAcompanhante: 1, codigoENome: "H54.0 - Cegueira binocular" },
  { id: 2, codigo: "G80.0", nome: "Paralisia cerebral espástica", direitoAcompanhante: 1, codigoENome: "G80.0 - Paralisia cerebral espástica" },
  { id: 3, codigo: "F84.0", nome: "Autismo infantil", direitoAcompanhante: 1, codigoENome: "F84.0 - Autismo infantil" },
  { id: 4, codigo: "H90.3", nome: "Perda de audição neurossensorial bilateral", direitoAcompanhante: 0, codigoENome: "H90.3 - Perda de audição neurossensorial bilateral" },
  { id: 5, codigo: "M51.1", nome: "Transtornos de discos lombares", direitoAcompanhante: 0, codigoENome: "M51.1 - Transtornos de discos lombares" },
];

export const instituicoesMock: Instituicao[] = [
  {
    id: 1,
    nome: "Escola Estadual Dom Pedro II",
    endereco: {
      id: 1,
      cidadeId: 1,
      logradouro: "Rua Barão de Jaguara",
      numero: "1200",
      bairro: "Centro",
      cep: "13015002",
      cidade: { nome: "Campinas", iss: 2, estado: { id: 25, nome: "São Paulo", sigla: "SP" } },
    },
  },
  {
    id: 2,
    nome: "Universidade Estadual de Campinas",
    endereco: {
      id: 2,
      cidadeId: 1,
      logradouro: "Cidade Universitária Zeferino Vaz",
      numero: "s/n",
      bairro: "Barão Geraldo",
      cep: "13083970",
      cidade: { nome: "Campinas", iss: 2, estado: { id: 25, nome: "São Paulo", sigla: "SP" } },
    },
  },
  {
    id: 3,
    nome: "Colégio Técnico de Campinas",
    endereco: {
      id: 3,
      cidadeId: 1,
      logradouro: "Rua Culto à Ciência",
      numero: "177",
      bairro: "Botafogo",
      cep: "13020060",
      cidade: { nome: "Campinas", iss: 2, estado: { id: 25, nome: "São Paulo", sigla: "SP" } },
    },
  },
];

export const solicitacoesVtMock: SolicitacaoAtivacaoVT[] = [
  {
    id: 1,
    carteiraId: 2,
    dataCriacao: hojeMenos(18),
    status: StatusSolicitacaoAtivacaoVtEnum.resolvidoManual,
    tipoDocumento: TipoDocumentoEnum.documentoIdentificacao,
    dataAprovacao: hojeMenos(16),
  },
  {
    id: 2,
    carteiraId: 2,
    dataCriacao: hojeMenos(5),
    status: StatusSolicitacaoAtivacaoVtEnum.processando,
    tipoDocumento: TipoDocumentoEnum.documentoIdentificacao,
  },
  {
    id: 3,
    carteiraId: 2,
    dataCriacao: hojeMenos(60),
    status: StatusSolicitacaoAtivacaoVtEnum.reprovadoManual,
    tipoDocumento: TipoDocumentoEnum.documentoIdentificacao,
    dataReprovacao: hojeMenos(58),
    motivoReprovacao: "Foto do documento sem nitidez suficiente para validação.",
  },
];

export const tarifasMock: Tarifa[] = [
  {
    id: 1,
    dataCriacao: hojeMenos(120),
    ativo: true,
    codigoTarifa: "CPS-URB",
    bilhetadoraId: 1,
    valorBuspay: 4.9,
    valorPublico: 5.5,
    valorVT: 4.9,
    valorDinheiro: 5.75,
    descricao: "Tarifa urbana — Campinas",
    observacao: "Integração gratuita por 90 minutos entre linhas urbanas.",
    dataInicioVigencia: hojeMenos(90),
  },
  {
    id: 2,
    dataCriacao: hojeMenos(120),
    ativo: true,
    codigoTarifa: "SOR-URB",
    bilhetadoraId: 2,
    valorBuspay: 4.6,
    valorPublico: 5.2,
    valorVT: 4.6,
    valorDinheiro: 5.4,
    descricao: "Tarifa urbana — Sorocaba",
    observacao: "Integração gratuita por 60 minutos entre linhas urbanas.",
    dataInicioVigencia: hojeMenos(75),
  },
];

export const linhasMock: Linha[] = [
  { id: 1, nome: "Terminal Central / Barão Geraldo", codigo: "331", codigoPublico: "331", operadoraId: 1, codigoENome: "331 - Terminal Central / Barão Geraldo" },
  { id: 2, nome: "Jardim Eulina / Centro", codigo: "202", codigoPublico: "202", operadoraId: 1, codigoENome: "202 - Jardim Eulina / Centro" },
  { id: 3, nome: "Terminal Vila União / Shopping", codigo: "118", codigoPublico: "118", operadoraId: 2, codigoENome: "118 - Terminal Vila União / Shopping" },
  { id: 4, nome: "Campo Grande / Terminal Central", codigo: "245", codigoPublico: "245", operadoraId: 2, codigoENome: "245 - Campo Grande / Terminal Central" },
];

export const onibusMock: Onibus[] = [
  { id: 1, prefixo: "12345", linhaId: 1, latitude: -22.9035, longitude: -47.0616, sentido: 1, velocidade: 32, distancia: 0.8, previsaoChegada: "4 min", atualizadoEm: new Date().toISOString() },
  { id: 2, prefixo: "12390", linhaId: 1, latitude: -22.8975, longitude: -47.0552, sentido: 2, velocidade: 24, distancia: 2.1, previsaoChegada: "11 min", atualizadoEm: new Date().toISOString() },
  { id: 3, prefixo: "20781", linhaId: 2, latitude: -22.9105, longitude: -47.0701, sentido: 1, velocidade: 18, distancia: 1.4, previsaoChegada: "7 min", atualizadoEm: new Date().toISOString() },
];

export const lojasMock: Loja[] = [
  {
    nomeFantasia: "Banca Central",
    logradouro: "Av. Francisco Glicério",
    enderecoNumero: "1200",
    bairro: "Centro",
    cep: "13012100",
    complemento: "Esquina com a Rua Barão",
    cidade: "Campinas",
    distancia: 0.4,
    telefone: "1932311234",
    celular: "19998877665",
    latitudeLoja: -22.9056,
    longitudeLoja: -47.0608,
  },
  {
    nomeFantasia: "Lotérica Bom Retiro",
    logradouro: "Rua Dr. Quirino",
    enderecoNumero: "540",
    bairro: "Centro",
    cep: "13015081",
    complemento: "",
    cidade: "Campinas",
    distancia: 1.1,
    telefone: "1932315678",
    celular: "19998811223",
    latitudeLoja: -22.9032,
    longitudeLoja: -47.0591,
  },
  {
    nomeFantasia: "Mercado Vila União",
    logradouro: "Av. John Boyd Dunlop",
    enderecoNumero: "3400",
    bairro: "Vila União",
    cep: "13060000",
    complemento: "Loja 12",
    cidade: "Campinas",
    distancia: 3.7,
    telefone: "1932319900",
    celular: "19997733445",
    latitudeLoja: -22.9201,
    longitudeLoja: -47.1183,
  },
];

const notificacoes7Dias: Notificacao[] = [
  {
    contaId: usuarioMock.id,
    dataHoraCriacao: hojeMenos(0),
    dataHoraEnvio: hojeMenos(0),
    titulo: "Pagamento confirmado",
    mensagem: "Sua passagem de R$ 4,90 foi debitada da carteira Comum.",
    situacao: SituacaoNotificacaoEnum.recebida,
    tipo: NotificacaoTipoEnum.debito,
  },
  {
    contaId: usuarioMock.id,
    dataHoraCriacao: hojeMenos(1),
    dataHoraEnvio: hojeMenos(1),
    titulo: "Recarga aprovada",
    mensagem: "Sua recarga de R$ 50,00 via Pix foi creditada.",
    situacao: SituacaoNotificacaoEnum.recebida,
    tipo: NotificacaoTipoEnum.credito,
  },
  {
    contaId: usuarioMock.id,
    dataHoraCriacao: hojeMenos(3),
    dataHoraEnvio: hojeMenos(3),
    titulo: "Benefício próximo do vencimento",
    mensagem: "Seu benefício Estudante vence em 45 dias. Renove para continuar utilizando.",
    situacao: SituacaoNotificacaoEnum.visualizada,
    dataHoraVisualizacao: hojeMenos(2),
    tipo: NotificacaoTipoEnum.beneficio,
  },
];

const notificacoesDemaisDias: Notificacao[] = [
  {
    contaId: usuarioMock.id,
    dataHoraCriacao: hojeMenos(12),
    dataHoraEnvio: hojeMenos(12),
    titulo: "Nova tarifa em vigor",
    mensagem: "A partir de hoje a tarifa urbana de Campinas passa a ser R$ 4,90 no app Buspay.",
    situacao: SituacaoNotificacaoEnum.visualizada,
    dataHoraVisualizacao: hojeMenos(11),
    tipo: NotificacaoTipoEnum.comunicado,
  },
  {
    contaId: usuarioMock.id,
    dataHoraCriacao: hojeMenos(25),
    dataHoraEnvio: hojeMenos(25),
    titulo: "Vale transporte creditado",
    mensagem: "Seu empregador creditou R$ 128,20 na carteira Vale Transporte.",
    situacao: SituacaoNotificacaoEnum.visualizada,
    dataHoraVisualizacao: hojeMenos(24),
    tipo: NotificacaoTipoEnum.credito,
  },
];

export const notificacoesMock: NotificacoesRetorno = {
  quantidadeNaoVisualizadas: 2,
  listaNotificacoesUltimos7Dias: notificacoes7Dias,
  listaNotificacoesDemaisDias: notificacoesDemaisDias,
};

export const ajudaMock: AjudaItem[] = [
  {
    id: 1,
    titulo: "O que é a Buspay?",
    texto:
      "<p>A Buspay é a plataforma de pagamento de passagens do transporte público. Com ela você recarrega, acompanha seu saldo e paga a passagem direto pelo aplicativo, usando QR Code ou reconhecimento facial.</p>",
    ajudaSubCategoriaId: 1,
    ativo: true,
    campoPesquisa: "o que é a buspay",
    subCategoria: {
      id: 1,
      codigo: 1,
      descricao: "Conhecendo a Buspay",
      categoriaId: 1,
      categoria: { id: 1, codigo: 1, descricao: "Sobre a Buspay" },
    },
  },
  {
    id: 2,
    titulo: "Como faço uma recarga?",
    texto:
      "<p>Acesse o menu <b>Recarga</b>, escolha a carteira e o valor desejado e selecione a forma de pagamento (Pix ou cartão de crédito). O crédito fica disponível em instantes após a confirmação.</p>",
    ajudaSubCategoriaId: 2,
    ativo: true,
    campoPesquisa: "como faço uma recarga",
    subCategoria: {
      id: 2,
      codigo: 2,
      descricao: "Recarga",
      categoriaId: 2,
      categoria: { id: 2, codigo: 2, descricao: "App Buspay" },
    },
  },
  {
    id: 3,
    titulo: "Como pagar a passagem com QR Code?",
    texto:
      "<p>Na tela inicial, toque em <b>Pagar passagem</b>. O aplicativo gera um QR Code válido por alguns instantes. Aproxime o código do validador do ônibus para concluir o pagamento.</p>",
    ajudaSubCategoriaId: 3,
    ativo: true,
    campoPesquisa: "como pagar a passagem com qr code",
    subCategoria: {
      id: 3,
      codigo: 3,
      descricao: "Pagamento de passagem",
      categoriaId: 2,
      categoria: { id: 2, codigo: 2, descricao: "App Buspay" },
    },
  },
  {
    id: 4,
    titulo: "Como solicitar um benefício de gratuidade?",
    texto:
      "<p>Vá em <b>Meus benefícios</b> e toque em <b>Nova solicitação</b>. Escolha o tipo de benefício, anexe os documentos solicitados e aguarde a análise, que costuma levar até 5 dias úteis.</p>",
    ajudaSubCategoriaId: 4,
    ativo: true,
    campoPesquisa: "como solicitar um benefício de gratuidade",
    subCategoria: {
      id: 4,
      codigo: 4,
      descricao: "Benefícios",
      categoriaId: 2,
      categoria: { id: 2, codigo: 2, descricao: "App Buspay" },
    },
  },
  {
    id: 5,
    titulo: "Perdi meu celular. O que faço?",
    texto:
      "<p>Entre em contato com a nossa central pelo menu <b>Fale conosco</b> para solicitar o bloqueio preventivo da sua conta. Seu saldo permanece preservado e pode ser liberado em um novo dispositivo.</p>",
    ajudaSubCategoriaId: 5,
    ativo: true,
    campoPesquisa: "perdi meu celular o que faço",
    subCategoria: {
      id: 5,
      codigo: 5,
      descricao: "Segurança",
      categoriaId: 1,
      categoria: { id: 1, codigo: 1, descricao: "Sobre a Buspay" },
    },
  },
  {
    id: 6,
    titulo: "Como funciona o Vale Transporte no app?",
    texto:
      "<p>O crédito de vale transporte é enviado pelo seu empregador e aparece na carteira <b>Vale Transporte</b>. Para liberá-lo pela primeira vez pode ser necessário enviar uma foto do seu documento de identificação.</p>",
    ajudaSubCategoriaId: 6,
    ativo: true,
    campoPesquisa: "como funciona o vale transporte no app",
    subCategoria: {
      id: 6,
      codigo: 6,
      descricao: "Vale Transporte",
      categoriaId: 2,
      categoria: { id: 2, codigo: 2, descricao: "App Buspay" },
    },
  },
];

export const contratosAdesaoMock: ContratoAdesaoApp[] = [
  { id: 1, contratoAdesaoAppTipoId: 1, descricaoTipo: "Termo de Uso", dataAtivacao: hojeMenos(300) },
  { id: 2, contratoAdesaoAppTipoId: 2, descricaoTipo: "Política de Privacidade", dataAtivacao: hojeMenos(300) },
];

export const termoUsoConteudoMock = `
<h5>Termo de Uso e Política de Privacidade — Buspay</h5>
<p><b>1. Objeto.</b> Este termo regula o uso do aplicativo Buspay, destinado ao pagamento de passagens
do transporte público coletivo, consulta de saldo, recarga e solicitação de benefícios de gratuidade.</p>
<p><b>2. Cadastro.</b> O usuário declara que as informações fornecidas no cadastro são verdadeiras e se
compromete a mantê-las atualizadas. O uso do aplicativo é pessoal e intransferível.</p>
<p><b>3. Pagamento de passagem.</b> O pagamento é realizado mediante leitura de QR Code gerado pelo
aplicativo ou por reconhecimento facial, sempre com débito do saldo disponível na carteira selecionada.</p>
<p><b>4. Recargas.</b> As recargas podem ser realizadas por Pix ou cartão de crédito e ficam disponíveis
após a confirmação do pagamento pela instituição financeira.</p>
<p><b>5. Benefícios.</b> A concessão de benefícios de gratuidade ou desconto segue a legislação municipal
aplicável e depende da análise da documentação enviada pelo usuário.</p>
<p><b>6. Privacidade.</b> Os dados pessoais coletados são tratados conforme a Lei nº 13.709/2018 (LGPD)
e utilizados exclusivamente para a prestação dos serviços descritos neste termo.</p>
<p><b>7. Encerramento.</b> O usuário pode solicitar o encerramento da conta a qualquer momento pelo menu
Meu Perfil. Saldos remanescentes seguem as regras de reembolso da operadora responsável.</p>
`;

export const faqRecargaMock = [
  {
    id: 1,
    pergunta: "Em quanto tempo a recarga fica disponível?",
    resposta:
      "Recargas por Pix costumam ser creditadas em até 5 minutos. Recargas por cartão de crédito dependem da confirmação da operadora e podem levar até 1 hora.",
  },
  {
    id: 2,
    pergunta: "Qual é o valor mínimo de recarga?",
    resposta: "O valor mínimo é de R$ 5,00 para Pix e R$ 10,00 para cartão de crédito.",
  },
  {
    id: 3,
    pergunta: "Posso recarregar a carteira de um dependente?",
    resposta:
      "Sim. Na tela de recarga selecione o dependente desejado antes de escolher o valor e a forma de pagamento.",
  },
  {
    id: 4,
    pergunta: "A recarga não apareceu no meu saldo. O que fazer?",
    resposta:
      "Atualize a tela inicial puxando a lista para baixo. Se após 1 hora o crédito não aparecer, entre em contato pelo Fale Conosco com o comprovante em mãos.",
  },
];

export const motivosEncerramentoMock = [
  { id: 1, descricao: "Não gosto do aplicativo" },
  { id: 2, descricao: "Fui mal atendido" },
  { id: 3, descricao: "Não consegui usar" },
  { id: 4, descricao: "Prefiro não responder" },
  { id: 5, descricao: "Outro motivo" },
];

export const valoresRecargaSugeridos = [10, 20, 30, 50, 100, 200];

export const qrCodePagamentoMock = {
  qrCode:
    "00020126580014BR.GOV.BCB.PIX0136buspay-mock-qrcode-pagamento-passagem5204000053039865802BR5913BUSPAY MOCK6009CAMPINAS62070503***6304A1B2",
  payload: "BUSPAY|MOCK|PAGAMENTO|PASSAGEM|v1",
};

export const pixRecargaMock = {
  qrCode:
    "00020126580014BR.GOV.BCB.PIX0136buspay-mock-qrcode-recarga-pix-01520400005303986540530.005802BR5913BUSPAY MOCK6009CAMPINAS62070503***63041D2C",
  copiaECola:
    "00020126580014BR.GOV.BCB.PIX0136buspay-mock-qrcode-recarga-pix-01520400005303986540530.005802BR5913BUSPAY MOCK6009CAMPINAS62070503***63041D2C",
  expiraEm: 30 * 60,
};

export const geolocalizacaoMock = { latitude: "-22.9056", longitude: "-47.0608" };

export const versaoAppMock = "3.14.0";
