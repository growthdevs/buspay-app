import {
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { chevronDownOutline, chevronForwardOutline, chevronUpOutline } from "ionicons/icons";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { BackButton } from "../../components/shared/back-button";
import { BpChamadaByx } from "../../components/shared/bp-chamada-byx";
import { BpTabs } from "../../components/shared/bp-tabs";
import { overlayService } from "../../lib/overlay";
import { formatarCelular } from "../../lib/mask-tools";
import { lojasMock } from "../../mocks/data";
import "./pontos-de-recarga.scss";

export const Route = createFileRoute("/buspay/pontos-de-recarga")({
  component: PontosDeRecargaPage,
});

function PontosDeRecargaPage() {
  const [busca, setBusca] = useState("");
  const [mostrar, setMostrar] = useState(true);
  const lojas = useMemo(
    () =>
      lojasMock.filter((l) =>
        `${l.nomeFantasia} ${l.logradouro} ${l.bairro} ${l.cidade}`.toLowerCase().includes(busca.toLowerCase()),
      ),
    [busca],
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-padding" color="primary">
          <BackButton />
          <h4>Pontos de recarga</h4>
          <span>Encontre o ponto de recarga Buspay mais próximo de você.</span>
        </IonToolbar>
      </IonHeader>
      <IonSearchbar
        value={busca}
        onIonInput={(e) => setBusca(String(e.detail.value ?? ""))}
        placeholder="Pesquisar por loja, endereço, bairro"
      />
      <div id="divMapa" />
      <IonList lines="none">
        <IonItem onClick={() => setMostrar((v) => !v)} className="accordion-header-lista-postos">
          <IonLabel>
            <b>Lista de Postos:</b>
          </IonLabel>
          <IonText slot="end">
            <IonIcon className="pontos-recarga-lista-icon" icon={mostrar ? chevronDownOutline : chevronUpOutline} />
          </IonText>
        </IonItem>
      </IonList>
      <IonContent>
        <BpChamadaByx pagina="pontoRecarga" />
        {mostrar && (
          <IonList className="lista-posto-accordion" lines="none">
            {lojas.length === 0 && (
              <IonItem className="lista-posto-item">
                <IonText>
                  <span className="item-nome-loja">Nenhuma loja encontrada em sua localização</span>
                  <p className="item-endereco-loja">
                    Utilize o campo de pesquisa para localizar o posto de recarga desejado.
                  </p>
                </IonText>
              </IonItem>
            )}
            {lojas.map((loja) => (
              <IonItem
                key={loja.nomeFantasia}
                className="lista-posto-item"
                onClick={() =>
                  overlayService.alert({
                    header: loja.nomeFantasia,
                    message: `${loja.logradouro}, ${loja.enderecoNumero} ${loja.complemento}\n${loja.bairro} - ${loja.cidade}\n${formatarCelular(loja.celular)}\n${loja.distancia} km`,
                    buttons: [{ text: "Ok" }],
                  })
                }
              >
                <IonText>
                  <span className="item-nome-loja">{loja.nomeFantasia}</span>
                  <p className="item-endereco-loja">
                    {loja.logradouro}, {loja.enderecoNumero} {loja.complemento}
                  </p>
                </IonText>
                <IonText className="item-end" slot="end">
                  <span className="item-lista-posto-km">{loja.distancia} km</span>
                  <IonIcon icon={chevronForwardOutline} />
                </IonText>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
      <IonFooter>
        <BpTabs />
      </IonFooter>
    </IonPage>
  );
}
