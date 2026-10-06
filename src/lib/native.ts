/**
 * Mocks dos plugins nativos do Capacitor (câmera, share, browser, geolocalização,
 * brilho, biometria). No navegador as ações equivalentes são usadas.
 */

import { overlayService } from "./overlay";

export async function abrirNavegador(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function compartilhar(opcoes: { title?: string; text?: string; url?: string; dialogTitle?: string }) {
  const texto = [opcoes.title, opcoes.text, opcoes.url].filter(Boolean).join("\n");
  try {
    if (navigator.share) {
      await navigator.share({
        ...(opcoes.title ? { title: opcoes.title } : {}),
        ...(opcoes.text ? { text: opcoes.text } : {}),
        ...(opcoes.url ? { url: opcoes.url } : {}),
      });
      return;
    }
  } catch {
    /* usuário cancelou */
  }
  if (texto) {
    await navigator.clipboard.writeText(texto).catch(() => undefined);
    await overlayService.toast({ message: "Conteúdo copiado para a área de transferência.", color: "success" });
  }
}

export async function copiarTexto(texto: string, mensagem = "Código copiado.") {
  await navigator.clipboard.writeText(texto).catch(() => undefined);
  await overlayService.toast({ message: mensagem, color: "success" });
}

export async function tirarFotoMock(): Promise<string> {
  await overlayService.toast({
    message: "Câmera nativa indisponível no navegador. Usamos uma selfie de demonstração.",
    color: "warning",
    duration: 2500,
  });
  return "/assets/images/perfil/face.png";
}

export function geolocalizacaoMock() {
  return { latitude: -22.9056, longitude: -47.0608 };
}

export async function delay(ms = 500) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
