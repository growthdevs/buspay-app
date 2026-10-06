import { IonButton, IonCard, IonCardContent, IonContent, IonImg, IonRow, IonText } from "@ionic/react";

import { BpAlertTypeEnum } from "../../core/enums";
import type { DismissFn } from "../../lib/modal";
import "./bp-alert.scss";

export function BpAlert({
  dismiss,
  titulo,
  mensagem,
  labelBotao = "Ok",
  alertType = BpAlertTypeEnum.sucesso,
}: {
  dismiss: DismissFn;
  titulo?: string;
  mensagem: string;
  labelBotao?: string;
  alertType?: BpAlertTypeEnum;
}) {
  const img = alertType === BpAlertTypeEnum.cadastroInicial ? "/assets/images/shared/happy.png" : "/assets/images/shared/success.png";
  return (
    <IonContent className="bg-auth">
      <div className="safe-area-top" />
      <IonRow className="bg-logo">
        <IonImg className="logo-ion-img" src="/assets/images/shared/bp-logo.svg" alt="Buspay" />
      </IonRow>
      <div className="bp-container">
        <IonCard>
          <IonCardContent style={{ padding: "5%" }}>
            <IonText>
              {titulo && <h1 className="alert-title">{titulo}</h1>}
              <p className="alert-sub-titulo">{mensagem}</p>
            </IonText>
            <IonRow>
              <IonImg className="alert-ion-img" src={img} />
            </IonRow>
            <div className="row">
              <IonButton type="button" className="bp-btn-primary" onClick={() => dismiss(true)}>
                {labelBotao}
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    </IonContent>
  );
}
