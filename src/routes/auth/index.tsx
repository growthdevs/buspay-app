import { IonButton, IonContent, IonGrid, IonImg, IonPage, IonRow } from "@ionic/react";
import { createFileRoute } from "@tanstack/react-router";

import { ModalLogin } from "../../components/auth/modal-login";
import { useModal } from "../../lib/modal";
import "./auth.scss";

export const Route = createFileRoute("/auth/")({
  component: AuthPage,
});

function AuthPage() {
  const { present } = useModal();

  const showModalLogin = () => {
    present((dismiss) => <ModalLogin dismiss={dismiss} conectado={navigator.onLine} />, {
      backdropDismiss: false,
      cssClass: "modal-fullscreen",
    });
  };

  return (
    <IonPage className="page-auth">
      <IonContent className="bg-auth">
        <div className="safe-area-top" />

        <IonGrid>
          <IonRow className="bg-logo-align">
            <IonImg src="/assets/images/shared/bp-logo.svg" alt="Buspay" className="bg-logo" />
          </IonRow>
        </IonGrid>

        <div className="card-bottom ion-padding">
          <div className="row">
            <div className="col">
              <span className="txt-mensagem-promo">Agora você paga</span>
            </div>
          </div>

          <br />

          <div className="row">
            <div className="col">
              <span className="txt-mensagem-promo">sua passagem com</span>
            </div>
          </div>

          <br />

          <div className="row">
            <div className="col">
              <span className="txt-mensagem-promo">
                <b>um sorriso*.</b>
              </span>
            </div>
          </div>

          <br />
          <br />

          <IonButton expand="block" color="warning" className="btn-comece-agora" onClick={showModalLogin}>
            Comece agora
          </IonButton>

          <br />

          <span className="txt-aviso-promo">
            * Pagamentos realizados por reconhecimento facial, utilizando o saldo disponível do
            usuário.
          </span>
        </div>
      </IonContent>
    </IonPage>
  );
}
