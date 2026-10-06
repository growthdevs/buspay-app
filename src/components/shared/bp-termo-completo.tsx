import { IonButton, IonContent, IonHeader, IonImg, IonToolbar } from "@ionic/react";

import type { DismissFn } from "../../lib/modal";

export function BpTermoCompleto({
  dismiss,
  titulo,
  conteudo,
}: {
  dismiss: DismissFn;
  titulo: string;
  conteudo: string;
}) {
  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className="ion-padding">
          <div className="safe-area-top" />
          <IonImg src="/assets/images/shared/LOGO_AZUL.svg" alt="Buspay" className="bg-logo-azul" />
          <p className="text-end fw-bold text-primary fs-xl m-0" role="button" onClick={() => dismiss()}>
            X
          </p>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h4 className="text-primary">{titulo}</h4>
        <div dangerouslySetInnerHTML={{ __html: conteudo }} />
        <IonButton expand="block" className="bp-btn-primary mt-4" onClick={() => dismiss(true)}>
          Fechar
        </IonButton>
      </IonContent>
    </>
  );
}
