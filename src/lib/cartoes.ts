import { TipoCartaoEnum } from "../core/enums";

/** Identifica a bandeira pelo prefixo (BIN) do número do cartão. */
export function detectarBandeira(numero: string): TipoCartaoEnum | undefined {
  const n = numero.replace(/\D/g, "");
  if (!n) return undefined;
  if (/^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(n)) return TipoCartaoEnum.Elo;
  if (/^(606282|3841)/.test(n)) return TipoCartaoEnum.Hipercard;
  if (/^3[47]/.test(n)) return TipoCartaoEnum.AmericanExpress;
  if (/^3(0[0-5]|[68])/.test(n)) return TipoCartaoEnum.DinersClub;
  if (/^35/.test(n)) return TipoCartaoEnum.JCB;
  if (/^6(011|5)/.test(n)) return TipoCartaoEnum.Discover;
  if (/^4/.test(n)) return 16 as TipoCartaoEnum; // Visa
  if (/^(5[1-5]|2[2-7])/.test(n)) return TipoCartaoEnum.Mastercard;
  return undefined;
}

const ICONES: Partial<Record<number, string>> = {
  [TipoCartaoEnum.AmericanExpress]: "amex.svg",
  [TipoCartaoEnum.Cabal]: "cabal.svg",
  [TipoCartaoEnum.DinersClub]: "dinersClub.svg",
  [TipoCartaoEnum.Discover]: "discover.svg",
  [TipoCartaoEnum.Elo]: "elo.svg",
  [TipoCartaoEnum.Hipercard]: "hipercard.svg",
  [TipoCartaoEnum.JCB]: "jcb.svg",
  [TipoCartaoEnum.Mastercard]: "mastercard.svg",
  [TipoCartaoEnum.SoroCred]: "sorocred.svg",
  16: "visa-azul.svg",
};

export function iconeBandeira(bandeira?: number): string | undefined {
  const arquivo = bandeira !== undefined ? ICONES[bandeira] : undefined;
  return arquivo ? `/assets/svg/bandeiras-cartoes/${arquivo}` : undefined;
}

export function numeroMascarado(ultimos4: string): string {
  return `**** **** **** ${ultimos4}`;
}
