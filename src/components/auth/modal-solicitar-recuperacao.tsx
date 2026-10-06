import { IonButton, IonContent, IonGrid, IonIcon, IonImg, IonNote, IonRow, IonText } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import type { DismissFn } from "../../lib/modal";
import { aplicarMascaraCpf, cpfValido } from "../../lib/mask-tools";
import { overlayService } from "../../lib/overlay";
import "./modal-solicitar-recuperacao.scss";

/** Porte de `pages/auth/modal-solicitar-recuperacao/*`. */
export function ModalSolicitarRecuperacao({ dismiss }: { dismiss: DismissFn }) {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const valido = cpfValido(cpf.replace(/\D/g, ""));

  const solicitarRecuperacao = async () => {
    await overlayService.toast({
      message: "Enviamos um código de recuperação para o e-mail e celular cadastrados.",
      color: "success",
    });
    dismiss(cpf);
    navigate({ to: "/auth/recuperar-senha" });
  };

  return (
    <IonContent className="ion-padding modal-solicitar-recuperacao">
      <div className="safe-area-top" />
      <IonGrid>
        <IonRow>
          <IonIcon icon={closeOutline} color="primary" style={{ zoom: 1.7 }} onClick={() => dismiss()} />
        </IonRow>

        <IonRow>
          <IonImg src="/assets/images/shared/LOGO_AZUL.svg" alt="Buspay" className="bg-logo-modal" />
        </IonRow>
        <br />
        <IonRow>
          <span className="label-titulo">Recuperar senha</span>
          <br />
          <span className="label-descricao">
            Informe seu <b>CPF</b> no campo abaixo para solicitar a recuperação:
          </span>
        </IonRow>
      </IonGrid>
      <br />
      <input
        id="cpf"
        type="text"
        inputMode="numeric"
        className="form-control bp-input"
        placeholder="123.456.789-10"
        value={cpf}
        onChange={(e) => setCpf(aplicarMascaraCpf(e.target.value))}
      />
      {!valido && (
        <IonRow>
          <IonNote className="validation-error" color="danger">
            Informe um CPF válido*
          </IonNote>
        </IonRow>
      )}
      <br />
      <IonButton
        type="submit"
        expand="block"
        color="primary"
        className="btn-entrar"
        onClick={solicitarRecuperacao}
        disabled={!valido}
      >
        Recuperar Senha
      </IonButton>
      <IonRow>
        <IonText className="btn-voltar" color="primary" onClick={() => dismiss()}>
          <p>Voltar</p>
        </IonText>
      </IonRow>
    </IonContent>
  );
}
