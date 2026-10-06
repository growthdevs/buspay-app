import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
} from "@ionic/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { BackButton } from "../../components/shared/back-button";
import { BpChamadaByx } from "../../components/shared/bp-chamada-byx";
import { BpPraca } from "../../components/shared/bp-praca";
import type { Praca } from "../../core/models";
import { formatarMoeda } from "../../lib/mask-tools";
import { abrirNavegador, delay } from "../../lib/native";
import { overlayService } from "../../lib/overlay";
import { tarifasMock } from "../../mocks/data";

export const Route = createFileRoute("/buspay/tarifas")({
  component: TarifasPage,
});

function TarifasPage() {
  const [praca, setPraca] = useState<Praca | undefined>();
  const tarifas = useMemo(
    () => tarifasMock.filter((t) => !praca || t.bilhetadoraId === praca.bilhetadora.id),
    [praca],
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-padding" color="primary">
          <BackButton />
          <h4>Tarifas</h4>
          <span className="bp-subtitle">Selecione um município para visualizar as tarifas.</span>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <BpChamadaByx pagina="tarifas" />
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (e) => {
            await delay(300);
            await overlayService.toast({ message: "Tarifas atualizadas.", color: "success", duration: 1500 });
            e.detail.complete();
          }}
        >
          <IonRefresherContent />
        </IonRefresher>
        <div className="ion-padding">
          <BpPraca onPracaSelected={setPraca} />
        </div>
        {tarifas.map((tarifa) => (
          <IonList className="px-2 pb-2" key={tarifa.id} lines="none">
            <IonListHeader>
              <IonLabel>{tarifa.descricao}</IonLabel>
            </IonListHeader>
            <IonItem>
              <IonLabel>Tarifa Vale Transporte: {formatarMoeda(tarifa.valorVT)}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Tarifa Comum: {formatarMoeda(tarifa.valorBuspay)}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Tarifa Dinheiro: {formatarMoeda(tarifa.valorDinheiro)}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Tarifa Municipal: {formatarMoeda(tarifa.valorPublico)}</IonLabel>
            </IonItem>
          </IonList>
        ))}
        <div className="alert alert-info p-0 my-0 mx-3">
          <p className="m-1">
            Maiores detalhes oficiais sobre a tarifa{" "}
            <b onClick={() => abrirNavegador("https://www.emdec.com.br")}> clique aqui! </b>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
}
