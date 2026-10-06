import {
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";

import type { DismissFn } from "../../lib/modal";
import { BpPraca } from "../shared/bp-praca";

export function FiltroExtrato({
  dismiss,
  dias,
  onAplicar,
}: {
  dismiss: DismissFn;
  dias: number;
  onAplicar: (dias: number) => void;
}) {
  const [selecionado, setSelecionado] = useState(dias);
  const opcoes = [7, 15, 30, 90];

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className="ion-padding">
          <div className="safe-area-top" />
          <p onClick={() => dismiss()}>X</p>
          <IonRow>
            <IonCol>
              <h3>Filtrar</h3>
            </IonCol>
            <IonCol className="text-end">
              <IonButton fill="outline" onClick={() => setSelecionado(90)}>
                Limpar
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p className="ion-padding mb-0">
          <b>Período de lançamento</b>
        </p>
        <IonRow className="ion-padding">
          {opcoes.map((d) => (
            <IonButton key={d} fill={selecionado === d ? "solid" : "outline"} onClick={() => setSelecionado(d)}>
              {d} dias
            </IonButton>
          ))}
        </IonRow>
        <p className="ion-padding mb-0">
          <b>Ordenação</b>
        </p>
        <IonList lines="none">
          <IonRadioGroup value="2">
            <IonItem>
              <IonRadio value="2" slot="start" />
              <IonLabel style={{ fontSize: 15 }}>Mais recentes</IonLabel>
            </IonItem>
            <IonItem>
              <IonRadio value="1" slot="start" />
              <IonLabel style={{ fontSize: 15 }}>Mais antigos</IonLabel>
            </IonItem>
          </IonRadioGroup>
        </IonList>
        <div className="ion-padding">
          <BpPraca />
        </div>
        <div className="d-flex justify-content-center mb-4">
          <IonButton
            onClick={() => {
              onAplicar(selecionado);
              dismiss();
            }}
          >
            Filtrar resultados
          </IonButton>
        </div>
      </IonContent>
    </>
  );
}
