import {
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { cardOutline, chevronForwardOutline } from "ionicons/icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { SelecaoPagamento } from "../../components/recarga/selecao-pagamento";
import { BpChamadaByx } from "../../components/shared/bp-chamada-byx";
import { BpPraca } from "../../components/shared/bp-praca";
import { BpTabs } from "../../components/shared/bp-tabs";
import type { Praca } from "../../core/models";
import { EnumTipoCarteiraExtratoApp } from "../../core/enums";
import { useModal } from "../../lib/modal";
import { useAppState } from "../../state/app-state";
import "./recarga.scss";

export const Route = createFileRoute("/buspay/recarga")({
  head: () => ({ meta: [
    { title: "Recarga | Aplicativo Buspay" },
    { name: "description", content: "Recarregue sua carteira Buspay com PIX ou cartão de crédito." },
    { property: "og:title", content: "Recarga | Aplicativo Buspay" },
    { property: "og:description", content: "Recarregue sua carteira Buspay com PIX ou cartão de crédito." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: RecargaPage,
});

function RecargaPage() {
  const navigate = useNavigate();
  const { present } = useModal();
  const { carteirasUsuario } = useAppState();
  const [praca, setPraca] = useState<Praca | undefined>();

  const mostrarComum = carteirasUsuario.some((c) => c.enumTipoCarteiraExtratoApp === EnumTipoCarteiraExtratoApp.Regular);
  const mostrarEstudante = carteirasUsuario.some(
    (c) => c.enumTipoCarteiraExtratoApp === EnumTipoCarteiraExtratoApp.Estudante,
  );

  const abrir = (tipo: "C" | "E") => {
    const carteira = carteirasUsuario.find((c) =>
      tipo === "C"
        ? c.enumTipoCarteiraExtratoApp === EnumTipoCarteiraExtratoApp.Regular
        : c.enumTipoCarteiraExtratoApp === EnumTipoCarteiraExtratoApp.Estudante,
    );
    present(
      (fechar) => (
        <SelecaoPagamento
          dismiss={fechar}
          tipoRecarga={tipo}
          saldoAtual={carteira?.saldo ?? 0}
          {...(praca ? { praca } : {})}
        />
      ),
      { backdropDismiss: false, cssClass: "modal-fullscreen" },
    );
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="recarga-toolbar ion-padding pb-0">
          <div className="safe-area-top" />
          <IonText className="ion-text-end">
            <p onClick={() => navigate({ to: "/buspay/home" })} className="btn-close-modal text-white m-0 fw-bold">
              X
            </p>
          </IonText>
          <div>
            <h1 className="fw-bold">Recarga</h1>
            <p className="recarga-text py-3 mb-0">
              Faça sua recarga utilizando as formas de pagamento disponíveis em sua cidade.
            </p>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <BpChamadaByx pagina="recarga" />
        <div className="padding-div-content mt-4">
          <p className="recarga-text small-font-text mb-3">
            Selecione abaixo, o local de utilização e a carteira que deseja recarregar.
          </p>
          <BpPraca onPracaSelected={setPraca} />
        </div>
        <IonList className="recarga-list mt-1" lines="full">
          {mostrarComum && (
            <IonItem className="recarga-item" onClick={() => abrir("C")} lines="none">
              <IonIcon slot="start" icon={cardOutline} className="cartao-icon itemC" />
              <IonLabel>Comum</IonLabel>
              <IonIcon slot="end" icon={chevronForwardOutline} />
            </IonItem>
          )}
          {mostrarEstudante && (
            <IonItem className="recarga-item" onClick={() => abrir("E")}>
              <IonIcon slot="start" icon={cardOutline} className="cartao-icon itemE" />
              <IonLabel>Estudante</IonLabel>
              <IonIcon slot="end" icon={chevronForwardOutline} />
            </IonItem>
          )}
        </IonList>
      </IonContent>
      <IonFooter>
        <BpTabs />
      </IonFooter>
    </IonPage>
  );
}
