/** Porte de `src/app/shared/tools/mask-tools.ts` e `cpf-tools.ts`. */

export function removerMask(value?: string | null): string {
  if (!value) return "";
  return value.replace(/\D/g, "");
}

export function aplicarMascaraCpf(valor?: string | null): string {
  const v = removerMask(valor).slice(0, 11);
  return v
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function aplicarMascaraCpfCnpj(valor?: string | null): string {
  let v = removerMask(valor);
  if (!v) return "";

  if (v.length <= 13) {
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  }

  v = v.replace(/^(\d{2})(\d)/, "$1.$2");
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
  v = v.replace(/(\d{4})(\d)/, "$1-$2");
  return v;
}

export function aplicarMascaraCelular(valor?: string | null): string {
  const v = removerMask(valor).slice(0, 11);
  if (v.length <= 2) return v;
  if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
}

export function aplicarMascaraData(valor?: string | null): string {
  const v = removerMask(valor).slice(0, 8);
  if (v.length <= 2) return v;
  if (v.length <= 4) return `${v.slice(0, 2)}/${v.slice(2)}`;
  return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
}

export function aplicarMascaraCep(valor?: string | null): string {
  const v = removerMask(valor).slice(0, 8);
  if (v.length <= 5) return v;
  return `${v.slice(0, 5)}-${v.slice(5)}`;
}

export function aplicarMascaraCartaoPadrao(valor?: string | null): string {
  const v = removerMask(valor).slice(0, 19);
  return v.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function aplicarMascaraCartaoEspecial(valor?: string | null): string {
  const v = removerMask(valor).slice(0, 15);
  const partes = [v.slice(0, 4), v.slice(4, 10), v.slice(10, 15)].filter(Boolean);
  return partes.join(" ");
}

export function aplicarMascaraCartaoValidade(valor?: string | null): string {
  const v = removerMask(valor).slice(0, 4);
  if (v.length <= 2) return v;
  return `${v.slice(0, 2)}/${v.slice(2)}`;
}

export function aplicarMascaraCartaoCvv(valor?: string | null): string {
  return removerMask(valor).slice(0, 4);
}

export function aplicarMascaraNis(valor?: string | null): string {
  const v = removerMask(valor).slice(0, 11);
  if (v.length <= 3) return v;
  if (v.length <= 8) return `${v.slice(0, 3)}.${v.slice(3)}`;
  if (v.length <= 10) return `${v.slice(0, 3)}.${v.slice(3, 8)}.${v.slice(8)}`;
  return `${v.slice(0, 3)}.${v.slice(3, 8)}.${v.slice(8, 10)}-${v.slice(10)}`;
}

export function aplicarMascaraNome(valor?: string | null): string {
  if (!valor) return "";
  return valor.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
}

export function aplicarMascaraMoneyBr(valor: string): string {
  let v = removerMask(valor);
  let tmp = `${v}`;
  tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
  if (tmp.length > 6) {
    tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
  }
  return tmp;
}

export function aplicarTruncateEmail(email?: string | null): string {
  if (!email) return "";
  const atIndex = email.indexOf("@");
  if (atIndex === -1) return email;

  const username = email.substring(0, atIndex);
  const domain = email.substring(atIndex + 1);
  const truncatedUsername =
    username.substring(0, 1) + "*".repeat(Math.max(username.length - 2, 0)) + username.slice(-1);

  return `${truncatedUsername}@${domain}`;
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

export function formatarCelular(celular?: string | null): string {
  if (!celular) return "";
  const limpo = celular.replace("+55", "");
  return `(${limpo.substring(0, 2)}) ${limpo.substring(2, 7)}-${limpo.substring(7, 12)}`;
}

export function formatarTelefone(telefone?: string | null): string {
  if (!telefone) return "";
  const limpo = telefone.replace("+55", "");
  return `(${limpo.substring(0, 2)}) ${limpo.substring(2, 6)}-${limpo.substring(6, 11)}`;
}

export function esconderDigitosCel(celular?: string | null): string {
  if (!celular) return "";
  return "*******-" + celular.substring(10, 14);
}

export function retiraAcentos(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Porte de `src/app/shared/tools/cpf-tools.ts`. */
export function cpfValido(cpf?: string | null): boolean {
  let soma = 0;

  if (cpf === "12345678901") return true;
  if (cpf === undefined || cpf === null) return false;

  const strCPF = cpf.replace(/\D/g, "");
  const invalidos = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];
  if (invalidos.includes(strCPF) || strCPF.length !== 11) return false;

  for (let i = 1; i <= 9; i++) {
    soma += +strCPF.substring(i - 1, i) * (11 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== +strCPF.substring(9, 10)) return false;

  soma = 0;
  for (let k = 1; k <= 10; k++) {
    soma += +strCPF.substring(k - 1, k) * (12 - k);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === +strCPF.substring(10, 11);
}

/** Equivalente ao `currency: 'BRL'` usado nos templates Angular. */
export function formatarMoeda(valor?: number | null): string {
  return (valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Equivalente ao `date: 'dd/MM/yyyy'` do Angular. */
export function formatarData(data?: string | Date | null): string {
  if (!data) return "";
  const d = typeof data === "string" ? new Date(data) : data;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function formatarDataHora(data?: string | Date | null): string {
  if (!data) return "";
  const d = typeof data === "string" ? new Date(data) : data;
  if (Number.isNaN(d.getTime())) return "";
  return `${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
