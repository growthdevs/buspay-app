import { IonButton, IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { BackButton } from "../components/shared/back-button";
import { delay, tirarFotoMock } from "../lib/native";
import { overlayService } from "../lib/overlay";

export const Route = createFileRoute("/solicitar-desbloqueio-vt")({
  component: DesbloqueioVtPage,
});

function DesbloqueioVtPage() {
  const navigate = useNavigate();
  const [foto, setFoto] = useState("");

  const enviar = async () => {
    const loading = await overlayService.loading(undefined, "Enviando solicitação...");
    await delay(800);
    await loading.dismiss();
    await overlayService.toast({ message: "Solicitação de ativação de VT enviada.", color: "success" });
    navigate({ to: "/buspay/solicitacoes-vt" });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-padding" color="primary">
          <BackButton href="/buspay/home" />
          <h4>Ativar Vale Transporte</h4>
          <span className="bp-subtitle">Envie uma foto do documento de identificação para liberar o VT.</span>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>1. Posicione o documento em uma superfície plana.</p>
        <p>2. Fotografe a frente com todos os dados visíveis.</p>
        <img src="/assets/images/desbloqueio-vt/doc_example.svg" alt="Exemplo" className="d-block mx-auto my-3" style={{ maxWidth: 260 }} />
        <IonButton expand="block" fill="outline" onClick={async () => setFoto(await tirarFotoMock())}>
          {foto ? "Foto capturada" : "Fotografar documento"}
        </IonButton>
        <IonButton expand="block" className="bp-btn-primary mt-3" disabled={!foto} onClick={enviar}>
          Enviar solicitação
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
