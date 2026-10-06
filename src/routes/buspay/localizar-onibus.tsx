import {
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonSearchbar,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { chevronForwardOutline } from "ionicons/icons";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { BackButton } from "../../components/shared/back-button";
import { BpChamadaByx } from "../../components/shared/bp-chamada-byx";
import { BpPraca } from "../../components/shared/bp-praca";
import { BpTabs } from "../../components/shared/bp-tabs";
import { overlayService } from "../../lib/overlay";
import { linhasMock, onibusMock } from "../../mocks/data";
import "./localizar-onibus.scss";

export const Route = createFileRoute("/buspay/localizar-onibus")({
  component: LocalizarOnibusPage,
});

function LocalizarOnibusPage() {
  const [busca, setBusca] = useState("");
  const filtradas = useMemo(
    () =>
      linhasMock.filter((l) => `${l.nome} ${l.codigo} ${l.codigoENome}`.toLowerCase().includes(busca.toLowerCase())),
    [busca],
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-padding" color="primary">
          <BackButton />
          <h4>Localizar ônibus</h4>
          <span>Encontre o ônibus mais próximo de você.</span>
        </IonToolbar>
      </IonHeader>
      <div className="ion-padding">
        <BpPraca />
      </div>
      <div className="espaço-search">
        <IonSearchbar value={busca} onIonInput={(e) => setBusca(String(e.detail.value ?? ""))} placeholder="Informe o nome ou código da linha" />
      </div>
      <IonContent>
        <BpChamadaByx pagina="localizaOnibus" />
        {filtradas.length === 0 && (
          <IonItem className="lista-linha-onibus-item">
            <IonText>
              <b>Nenhuma linha encontrada...</b>
              <div>Selecione o município para a busca de linhas.</div>
            </IonText>
          </IonItem>
        )}
        {filtradas.map((linha) => (
          <IonItem
            key={linha.id}
            className="lista-linha-onibus-item"
            onClick={() => {
              const onibus = onibusMock.filter((o) => o.linhaId === linha.id);
              overlayService.alert({
                header: linha.codigoENome,
                message: onibus.length
                  ? onibus.map((o) => `Prefixo ${o.prefixo} · ${o.previsaoChegada} · ${o.distancia} km`).join("\n")
                  : "Nenhum ônibus em circulação no momento (simulação).",
                buttons: [{ text: "Ok" }],
              });
            }}
          >
            <IonText>
              <div>
                <span className="nome-linha-onibus">
                  <b>{linha.nome}</b>
                </span>
              </div>
              <div className="d-flex flex-row">
                <div>Código da linha:</div>
                <div className="numero-linha-onibus ms-2">
                  <span>{linha.codigo}</span>
                </div>
              </div>
            </IonText>
            <IonText slot="end">
              <IonIcon icon={chevronForwardOutline} />
            </IonText>
          </IonItem>
        ))}
      </IonContent>
      <IonFooter>
        <BpTabs />
      </IonFooter>
    </IonPage>
  );
}
