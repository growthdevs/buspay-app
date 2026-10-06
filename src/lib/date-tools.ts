export function maiorDeIdade(dataNascimento?: string | null): boolean {
  if (!dataNascimento) return false;
  const d = new Date(dataNascimento);
  if (Number.isNaN(d.getTime())) return false;
  const hoje = new Date();
  let idade = hoje.getFullYear() - d.getUTCFullYear();
  const m = hoje.getMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < d.getUTCDate())) idade -= 1;
  return idade >= 18;
}

export function diaDaSemana(data: string | Date): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleDateString("pt-BR", { weekday: "long" });
}

export function hojeOuOntem(data: string | Date): string {
  const d = typeof data === "string" ? new Date(data) : data;
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);
  if (d.toDateString() === hoje.toDateString()) return "Hoje";
  if (d.toDateString() === ontem.toDateString()) return "Ontem";
  return "";
}

export function titleCase(valor?: string | null): string {
  if (!valor) return "";
  return valor
    .toLowerCase()
    .split(" ")
    .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1) : p))
    .join(" ");
}
