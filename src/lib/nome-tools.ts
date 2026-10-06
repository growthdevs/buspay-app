/** Porte de `src/app/shared/tools/mascara-nome-tools.ts`. */

export function primeiroNome(nome?: string | null): string {
  if (!nome) return "";
  const parte = (nome.split(" ")[0] ?? "").toLowerCase();
  return parte.charAt(0).toUpperCase() + parte.slice(1);
}

export function primeiroUltimoNome(nome?: string | null): string {
  if (!nome) return "";
  const nomeSeparado = nome.split(" ");

  const capitalizar = (parte: string) => {
    const minusculo = parte.toLowerCase();
    return minusculo.charAt(0).toUpperCase() + minusculo.slice(1);
  };

  const primeiro = nomeSeparado[0] ?? "";
  const ultimo = nomeSeparado[nomeSeparado.length - 1] ?? "";
  if (nomeSeparado.length > 1) {
    return `${capitalizar(primeiro)} ${capitalizar(ultimo)}`;
  }
  return capitalizar(primeiro);
}

/** Nome exibido ao usuário: nome social se existir; senão, primeiro nome do documento. */
export function nomeApresentacao(nomeSocial?: string | null, nome?: string | null): string {
  if (nomeSocial) return nomeSocial;
  return primeiroNome(nome);
}

/** Nome exibido ao usuário: nome social se existir; senão, primeiro e último nome do documento. */
export function nomeApresentacaoCompleto(nomeSocial?: string | null, nome?: string | null): string {
  if (nomeSocial) return nomeSocial;
  return primeiroUltimoNome(nome);
}
