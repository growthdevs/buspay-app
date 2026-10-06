import { IonButton, IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { BackButton } from "../components/shared/back-button";
import { delay, tirarFotoMock } from "../lib/native";
import { overlayService } from "../lib/overlay";
import { useAppState } from "../state/app-state";

export const Route = createFileRoute("/tirar-selfie")({
  component: TirarSelfiePage,
});

function TirarSelfiePage() {
  const navigate = useNavigate();
  const { dadosUsuario, setDadosUsuario } = useAppState();
  const [foto, setFoto] = useState("");

  const capturar = async () => {
    const url = await tirarFotoMock();
    setFoto(url);
  };

  const enviar = async () => {
    const loading = await overlayService.loading(undefined, "Enviando selfie...");
    await delay(600);
    setDadosUsuario({ ...dadosUsuario, fotoPerfilUrl: foto || "/assets/images/perfil/face.png" });
    await loading.dismiss();
    await overlayService.toast({ message: "Selfie atualizada.", color: "success" });
    navigate({ to: "/buspay/perfil" });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-padding" color="primary">
          <BackButton href="/buspay/perfil" />
          <h4>Tirar selfie</h4>
          <span className="bp-subtitle">A câmera nativa é simulada neste ambiente web.</span>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding text-center">
        <img src={foto || "/assets/images/perfil/intro-selfie.png"} alt="Selfie" style={{ maxWidth: "80%", borderRadius: 12 }} />
        <p className="mt-3">Posicione o rosto no centro, em um ambiente bem iluminado e sem acessórios.</p>
        <IonButton expand="block" className="bp-btn-primary" onClick={capturar}>
          Capturar selfie
        </IonButton>
        <IonButton expand="block" fill="outline" disabled={!foto} onClick={enviar}>
          Enviar
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
