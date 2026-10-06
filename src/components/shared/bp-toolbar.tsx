import { IonBadge, IonButtons, IonIcon, IonImg, IonTabButton, IonToolbar } from "@ionic/react";
import { notificationsOutline } from "ionicons/icons";

import { useModal } from "../../lib/modal";
import { useAppState } from "../../state/app-state";
import { BpNotificacoes } from "./bp-notificacoes";
import "./bp-toolbar.scss";

export function BpToolbar() {
  const { present } = useModal();
  const { notificacoesRecebidas } = useAppState();
  const qtd = notificacoesRecebidas.quantidadeNaoVisualizadas ?? 0;

  const showNotificacoes = () => {
    present((dismiss) => <BpNotificacoes dismiss={dismiss} />, { backdropDismiss: false, cssClass: "modal-fullscreen" });
  };

  return (
    <IonToolbar className="bp-toolbar-bg d-flex align-items-center">
      <IonImg slot="start" className="p-4" src="/assets/images/shared/bp-logo.svg" />
      <IonButtons slot="end">
        <IonTabButton
          onClick={showNotificacoes}
          className="notifications-icon-toolbar"
          mode="md"
          style={{ background: "transparent" }}
        >
          <IonIcon icon={notificationsOutline} />
          {qtd > 0 && (
            <IonBadge className="notification-badge" color="warning">
              {qtd}
            </IonBadge>
          )}
        </IonTabButton>
      </IonButtons>
    </IonToolbar>
  );
}
