import type { AlertOptions, LoadingOptions, ToastOptions } from "@ionic/core";
import { useIonAlert, useIonLoading, useIonToast } from "@ionic/react";
import { useEffect, type ReactNode } from "react";

/**
 * Equivalente ao `OverlayService` do app Angular. Os hooks do Ionic React só
 * funcionam dentro de componentes, então o provider registra as funções em um
 * singleton para que qualquer módulo possa chamar `overlayService.toast(...)`
 * da mesma forma que o serviço injetável do Angular era usado.
 */
type LoadingHandle = { dismiss: () => Promise<void> | void };

type OverlayApi = {
  alert: (options?: AlertOptions) => Promise<void>;
  loading: (options?: LoadingOptions, message?: string) => Promise<LoadingHandle>;
  toast: (options?: ToastOptions) => Promise<void>;
  showAlertaErroComunicacaoServidor: (error?: unknown) => Promise<void>;
};

const noop = async () => {};

export const overlayService: OverlayApi = {
  alert: noop,
  loading: async () => ({ dismiss: noop }),
  toast: noop,
  showAlertaErroComunicacaoServidor: noop,
};

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();

  useEffect(() => {
    overlayService.alert = async (options) => {
      await presentAlert({ ...(options as AlertOptions) });
    };

    overlayService.toast = async (options) => {
      await presentToast({ position: "bottom", duration: 5000, ...(options as ToastOptions) });
    };

    overlayService.loading = async (options, message) => {
      await presentLoading({ message: message || "Aguarde...", ...(options as LoadingOptions) });
      return { dismiss: () => dismissLoading() };
    };

    overlayService.showAlertaErroComunicacaoServidor = async (error) => {
      if (error) console.error("Erro de comunicação com o servidor:", error);
      await presentAlert({
        header: "Prezado Cliente",
        message:
          "Houve um erro na comunicação com o servidor. Por favor, tente novamente em alguns instantes.",
        buttons: [{ text: "Ok" }],
        backdropDismiss: false,
      });
    };
  }, [presentAlert, presentToast, presentLoading, dismissLoading]);

  return <>{children}</>;
}
