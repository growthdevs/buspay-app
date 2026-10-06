/** Labels e ícones portados de `carteira-response.ts`, `lancamento-response.ts` e telas de benefício. */

import {
  BeneficioTipoEnum,
  EnumTipoCarteiraExtratoApp,
  NotificacaoTipoEnum,
  SolicitacaoBeneficioStatusEnum,
  StatusSolicitacaoAtivacaoVtEnum,
  TipoProcessoEnum,
  TipoTransacaoEnum,
} from "../core/enums";

export function labelCarteira(tipo?: number): string {
  switch (tipo) {
    case EnumTipoCarteiraExtratoApp.Regular:
      return "Comum";
    case EnumTipoCarteiraExtratoApp.VT:
      return "Vale Transporte";
    case EnumTipoCarteiraExtratoApp.Estudante:
      return "Estudante";
    case EnumTipoCarteiraExtratoApp.Todos:
      return "Todas as Carteiras";
    default:
      return "Outros";
  }
}

export function tituloCarteira(tipo?: number): string {
  switch (tipo) {
    case EnumTipoCarteiraExtratoApp.Regular:
      return "C";
    case EnumTipoCarteiraExtratoApp.VT:
      return "VT";
    case EnumTipoCarteiraExtratoApp.Estudante:
      return "E";
    default:
      return "Padrao";
  }
}

export function temaCarteira(tipo?: number): string {
  switch (tipo) {
    case EnumTipoCarteiraExtratoApp.Regular:
      return "C";
    case EnumTipoCarteiraExtratoApp.VT:
      return "VT";
    case EnumTipoCarteiraExtratoApp.Estudante:
      return "E";
    default:
      return "Padrao";
  }
}

export function iconeItemExtrato(processoTipo?: number): string {
  switch (processoTipo) {
    case TipoProcessoEnum.reversaoVT:
    case TipoProcessoEnum.criacao:
    case TipoProcessoEnum.integracao:
      return "bus-item-int";
    case TipoProcessoEnum.cobranca:
    case TipoProcessoEnum.expiracao:
      return "bus-item-deb";
    case TipoProcessoEnum.devolucao:
    case TipoProcessoEnum.recarga:
    case TipoProcessoEnum.ressarcimento:
      return "cifrao-item-cred";
    case TipoProcessoEnum.estorno:
      return "cifrao-item-deb";
    default:
      return "bus-item-deb";
  }
}

export function iconeDetalheExtrato(processoTipo?: number): string {
  switch (processoTipo) {
    case TipoProcessoEnum.reversaoVT:
    case TipoProcessoEnum.criacao:
    case TipoProcessoEnum.integracao:
      return "bus-detalhe-int";
    case TipoProcessoEnum.cobranca:
    case TipoProcessoEnum.expiracao:
      return "bus-detalhe-deb";
    case TipoProcessoEnum.devolucao:
    case TipoProcessoEnum.recarga:
    case TipoProcessoEnum.ressarcimento:
      return "cifrao-detalhe-cred";
    case TipoProcessoEnum.estorno:
      return "cifrao-detalhe-deb";
    default:
      return "bus-detalhe-deb";
  }
}

export function labelTipoTransacao(tipo?: number): string {
  if (tipo === TipoTransacaoEnum.credito) return "Crédito";
  if (tipo === TipoTransacaoEnum.debito) return "Débito";
  return "N/A";
}

export function labelTipoProcesso(tipo?: number): string {
  switch (tipo) {
    case TipoProcessoEnum.reversaoVT:
      return "Reversão de Crédito";
    case TipoProcessoEnum.cobranca:
      return "Cobrança";
    case TipoProcessoEnum.expiracao:
      return "Expiração";
    case TipoProcessoEnum.criacao:
      return "Criação";
    case TipoProcessoEnum.devolucao:
      return "Devolução";
    case TipoProcessoEnum.estorno:
      return "Estorno";
    case TipoProcessoEnum.integracao:
      return "Integração";
    case TipoProcessoEnum.recarga:
      return "Recarga";
    case TipoProcessoEnum.ressarcimento:
      return "Ressarcimento";
    default:
      return "N/A";
  }
}

export function iconeBeneficio(tipo?: BeneficioTipoEnum | number): string {
  const mapa: Record<number, string> = {
    1: "estudante.png",
    2: "vovozinho.png",
    3: "pcd.png",
    4: "funcionario.png",
    5: "faixa.png",
    6: "beneficio.png",
    11: "beneficio.png",
    12: "pcd_1.png",
  };
  return mapa[tipo ?? 6] ?? "beneficio.png";
}

export function labelStatusBeneficio(status?: SolicitacaoBeneficioStatusEnum): string {
  switch (status) {
    case SolicitacaoBeneficioStatusEnum.aprovada:
      return "Aprovada";
    case SolicitacaoBeneficioStatusEnum.reprovada:
      return "Reprovada";
    default:
      return "Em análise";
  }
}

export function classeBadgeBeneficio(status?: SolicitacaoBeneficioStatusEnum): string {
  switch (status) {
    case SolicitacaoBeneficioStatusEnum.aprovada:
      return "badge-aprovado";
    case SolicitacaoBeneficioStatusEnum.reprovada:
      return "badge-reprovado";
    default:
      return "badge-em-analise";
  }
}

export function iconeNotificacao(tipo?: NotificacaoTipoEnum): string {
  switch (tipo) {
    case NotificacaoTipoEnum.credito:
      return "/assets/images/notificacoes/credito.png";
    case NotificacaoTipoEnum.debito:
      return "/assets/images/notificacoes/debito.png";
    case NotificacaoTipoEnum.beneficio:
      return "/assets/images/notificacoes/beneficio.png";
    default:
      return "/assets/images/notificacoes/comunicados.png";
  }
}

export function labelStatusVt(status?: StatusSolicitacaoAtivacaoVtEnum): string {
  switch (status) {
    case StatusSolicitacaoAtivacaoVtEnum.resolvidoAutomatico:
    case StatusSolicitacaoAtivacaoVtEnum.resolvidoManual:
      return "Aprovada";
    case StatusSolicitacaoAtivacaoVtEnum.reprovadoAutomatico:
    case StatusSolicitacaoAtivacaoVtEnum.reprovadoManual:
      return "Reprovada";
    case StatusSolicitacaoAtivacaoVtEnum.processando:
      return "Em análise";
    default:
      return "Pendente";
  }
}

export function estiloStatusVt(status?: StatusSolicitacaoAtivacaoVtEnum): { color: string; fontWeight: number } {
  switch (status) {
    case StatusSolicitacaoAtivacaoVtEnum.resolvidoAutomatico:
    case StatusSolicitacaoAtivacaoVtEnum.resolvidoManual:
      return { color: "#0a8549", fontWeight: 700 };
    case StatusSolicitacaoAtivacaoVtEnum.reprovadoAutomatico:
    case StatusSolicitacaoAtivacaoVtEnum.reprovadoManual:
      return { color: "#ff0202", fontWeight: 700 };
    case StatusSolicitacaoAtivacaoVtEnum.processando:
      return { color: "#eb631a", fontWeight: 700 };
    default:
      return { color: "#575757", fontWeight: 700 };
  }
}

export function descricaoCarteira(tipo?: number): string {
  switch (tipo) {
    case EnumTipoCarteiraExtratoApp.Regular:
      return "Saldo da carteira comum, utilizado no pagamento da tarifa integral.";
    case EnumTipoCarteiraExtratoApp.VT:
      return "Saldo de Vale Transporte creditado pelo empregador.";
    case EnumTipoCarteiraExtratoApp.Estudante:
      return "Saldo da carteira estudantil, com desconto previsto em legislação.";
    default:
      return "Saldo consolidado de todas as carteiras.";
  }
}
