import { delay } from "./native";

export type CepEndereco = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  erro?: boolean;
};

const temTexto = (valor?: string) => !!`${valor ?? ""}`.trim();

/**
 * Consulta mockada de CEP (sem ViaCEP/API).
 * - `13000-000`: cidade preenchida, sem logradouro/bairro (campos manuais).
 * - `00000-000`: CEP inválido.
 * - demais CEPs com 8 dígitos: endereço completo.
 */
export async function consultarCepMock(cep: string): Promise<CepEndereco> {
  await delay(400);
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8 || digits === "00000000") {
    return { cep: digits, logradouro: "", bairro: "", localidade: "", uf: "", ibge: "", erro: true };
  }
  if (digits === "13000000") {
    return { cep: digits, logradouro: "", bairro: "", localidade: "Campinas", uf: "SP", ibge: "3509502" };
  }
  return {
    cep: digits,
    logradouro: "Rua das Palmeiras",
    bairro: "Centro",
    localidade: "Campinas",
    uf: "SP",
    ibge: "3509502",
  };
}

export function camposCepFaltantes(endereco: CepEndereco) {
  return {
    logradouro: !temTexto(endereco.logradouro),
    bairro: !temTexto(endereco.bairro),
    cidade: !temTexto(endereco.localidade),
  };
}
