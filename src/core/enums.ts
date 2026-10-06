/** Enums portados de `src/app/core/enums` do app Ionic/Angular. */

export enum TipoCarteiraEnum {
  comum = 1,
  vt = 2,
  estudante = 3,
  todos = 4,
}

export enum EnumTipoCarteiraExtratoApp {
  Regular = 1,
  VT = 2,
  Estudante = 3,
  Todos = 4,
}

export enum FormaPgtoPassagemEnum {
  qrcode = 1,
}

export enum ContaBloqueioTipoEnum {
  SaldoInsuficiente = 1,
  SemRecarga = 2,
  FurtoRoubo = 3,
  Perda = 4,
  Violacao = 5,
  UsoIndevido = 6,
}

export enum SolicitacaoBeneficioStatusEnum {
  pendente = 1,
  aprovada = 2,
  reprovada = 3,
}

export enum BeneficioTipoEnum {
  estudante = 1,
  idoso = 2,
  pcd = 3,
  funcionarioEmpresa = 4,
  faixaRenda = 5,
  outros = 6,
  professor = 7,
  aposentado = 8,
  pensionista = 9,
  desempregado = 10,
  geralGlobal = 11,
  pcdComAcompanhante = 12,
}

export enum BeneficioTipoUsoEnum {
  ilimitado = 1,
  diario = 2,
  semanal = 3,
  mensal = 4,
}

export enum BeneficioTipoDescontoEnum {
  percentual = 1,
  valor = 2,
  gratuidade = 3,
}

export enum TipoTransacaoEnum {
  debito = 1,
  credito = 2,
  todos = 3,
}

export enum TipoProcessoEnum {
  criacao = 1,
  cobranca = 2,
  recarga = 3,
  estorno = 4,
  integracao = 5,
  ressarcimento = 6,
  devolucao = 7,
  expiracao = 8,
  reversaoVT = 9,
}

export enum BpAlertTypeEnum {
  cadastroInicial = 1,
  sucesso = 2,
  atencao = 3,
  erro = 4,
}

export enum StatusSolicitacaoAtivacaoVtEnum {
  pendente = 1,
  resolvidoAutomatico = 2,
  reprovadoManual = 3,
  processando = 4,
  reprovadoAutomatico = 5,
  resolvidoManual = 6,
}

export enum TipoDocumentoEnum {
  biometria = 1,
  facial = 2,
  outros = 3,
  contratoSocial = 4,
  comprovanteEndereco = 5,
  documentoIdentificacao = 6,
  comprovanteMatricula = 7,
  documentoResponsavel = 8,
  comprovanteResponsavel = 9,
  certidaoNascimento = 10,
  cpf = 11,
}

export enum TipoInformacaoDocumentoEnum {
  foto = 1,
  documento = 2,
}

export enum SexoEnum {
  NaoEspecificado = 0,
  Feminino = 1,
  Masculino = 2,
  Outros = 3,
}

export enum CategoriaIdEnum {
  sobreBuspay = 1,
  appBuspay = 2,
}

export enum OrdenacaoExtratoEnum {
  crescente = 1,
  decrescente = 2,
}

export enum QtdDiasFiltroExtratoEnum {
  sete = 1,
  quinze = 2,
  trinta = 3,
  noventa = 4,
}

export enum TipoCartaoEnum {
  AmericanExpress = 1,
  Aura = 2,
  BaneseCard = 3,
  Cabal = 4,
  DinersClub = 5,
  Discover = 6,
  Elo = 7,
  FortBrasil = 8,
  GrandCard = 9,
  Hipercard = 10,
  JCB = 11,
  Mastercard = 12,
  PersonalCard = 13,
  SoroCred = 14,
  ValeCard = 15,
  Visa = 16,
  NaoCoberto = 17,
}

export enum MotivoExclusaoContaEnum {
  naoGosto = 1,
  malAtendido = 2,
  naoConseguiUsar = 3,
  naoResponser = 4,
  outro = 5,
}

export enum FormaPagamentoTipoEnum {
  cartaoCredito = 1,
  pix = 2,
  boleto = 3,
}

export enum TipoCarteiraRecargaEnum {
  comum = 1,
  estudante = 3,
}

export enum SentidoViagemOnibusEnum {
  ida = 1,
  volta = 2,
}

export enum TipoMarcadorMapaEnum {
  usuario = 1,
  onibus = 2,
  loja = 3,
  empresa = 4,
}

export enum NotificacaoTipoEnum {
  comunicado = 1,
  credito = 2,
  debito = 3,
  beneficio = 4,
}

export enum SituacaoNotificacaoEnum {
  enviada = 1,
  recebida = 2,
  visualizada = 3,
}

export enum VinculoMenorEnum {
  filho = 1,
  neto = 2,
  sobrinho = 3,
  irmao = 4,
  outros = 5,
}

export enum EstadoCivilEnum {
  solteiro = 1,
  casado = 2,
  divorciado = 3,
  viuvo = 4,
  separado = 5,
  uniaoEstavel = 6,
}

export enum PreferenciaEnum {
  receberNotificacoes = 1,
  receberEmails = 2,
  usarBiometria = 3,
}

export enum TipoEnvioConfirmacaoEnum {
  sms = 1,
  email = 2,
  whatsapp = 3,
}
