import { IonButton, IonCheckbox, IonContent, IonHeader, IonImg, IonItem, IonLabel } from "@ionic/react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { iconeBeneficio } from "../../lib/labels";
import { formatarData } from "../../lib/mask-tools";
import type { DismissFn } from "../../lib/modal";
import { beneficiosExpiradosMock } from "../../mocks/data";

export function NotificarExpiracao({ dismiss }: { dismiss: DismissFn }) {
  const navigate = useNavigate();
  const [ciente, setCiente] = useState(false);

  return (
    <>
      <IonHeader className="ion-no-border">
        <div className="safe-area-top" />
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="mb-4 px-3">
          <p className="fs-xl fw-bold mb-4 lh-1">Seus benefícios expiraram</p>
          <p className="text-black">
            Para renovar ou solicitar novamente, use o botão <strong>&quot;Gerenciar benefícios&quot;</strong>.
          </p>
        </div>
        <div className="mb-3 text-black">
          {beneficiosExpiradosMock.map((beneficio) => (
            <div key={beneficio.id} className="card rounded-4 shadow-sm border-1 mb-3">
              <div className="card-body p-3">
                <div className="d-flex align-items-start gap-2">
                  <IonImg
                    src={`/assets/icon/${iconeBeneficio(beneficio.regraBeneficio?.beneficioTipoId)}`}
                    className="flex-shrink-0"
                    style={{ width: 24, height: 24 }}
                  />
                  <div className="flex-grow-1">
                    <p className="fs-lg fw-bold text-black mb-2">{beneficio.regraBeneficio?.nome}</p>
                    <p className="mb-0 text-black fs-xs">
                      <b>Validade</b>
                    </p>
                    <p className="text-black mb-0">{formatarData(beneficio.dataValidade)}</p>
                  </div>
                  <span className="badge rounded-pill flex-shrink-0" style={{ background: "#fff9f5", color: "#4e2500" }}>
                    Expirado
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <IonItem lines="none" className="mb-3 fs-sm text-black">
          <IonCheckbox slot="start" checked={ciente} onIonChange={(e) => setCiente(e.detail.checked)} />
          <IonLabel>Estou ciente de que não posso usar estes benefícios até regularizá-los.</IonLabel>
        </IonItem>
        <IonButton
          expand="block"
          color="primary"
          className="mb-3"
          disabled={!ciente}
          onClick={() => {
            dismiss({ cienciaRegistrada: true });
            navigate({ to: "/buspay/beneficio" });
          }}
        >
          Gerenciar benefícios
        </IonButton>
        <IonButton expand="block" fill="outline" color="primary" disabled={!ciente} onClick={() => dismiss({ cienciaRegistrada: true })}>
          Fechar
        </IonButton>
      </IonContent>
    </>
  );
}
