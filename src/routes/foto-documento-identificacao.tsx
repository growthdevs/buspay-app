import { IonButton, IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { BackButton } from "../components/shared/back-button";
import { delay, tirarFotoMock } from "../lib/native";
import { overlayService } from "../lib/overlay";

export const Route = createFileRoute("/foto-documento-identificacao")({
  component: FotoDocumentoPage,
});

function FotoDocumentoPage() {
  const navigate = useNavigate();
  const [frente, setFrente] = useState("");
  const [verso, setVerso] = useState("");

  const enviar = async () => {
    const loading = await overlayService.loading(undefined, "Enviando documentos...");
    await delay(700);
    await loading.dismiss();
    await overlayService.toast({ message: "Documentos enviados para análise.", color: "success" });
    navigate({ to: "/buspay/home" });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-padding" color="primary">
          <BackButton />
          <h4>Foto do documento</h4>
          <span className="bp-subtitle">Envie frente e verso do documento com foto.</span>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding text-center">
        <img src="/assets/images/desbloqueio-vt/doc_example.svg" alt="Exemplo" style={{ maxWidth: 240 }} />
        <p className="mt-3">Evite reflexos e recortes. A foto precisa mostrar o documento inteiro.</p>
        <IonButton expand="block" fill="outline" onClick={async () => setFrente(await tirarFotoMock())}>
          {frente ? "Frente capturada" : "Fotografar frente"}
        </IonButton>
        <IonButton expand="block" fill="outline" onClick={async () => setVerso(await tirarFotoMock())}>
          {verso ? "Verso capturado" : "Fotografar verso"}
        </IonButton>
        <IonButton expand="block" className="bp-btn-primary mt-3" disabled={!frente || !verso} onClick={enviar}>
          Enviar
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
