import { IonContent, IonHeader, IonItem, IonLabel, IonPage, IonText, IonToolbar } from "@ionic/react";
import { createFileRoute } from "@tanstack/react-router";

import { BackButton } from "../../components/shared/back-button";
import { BpChamadaByx } from "../../components/shared/bp-chamada-byx";
import { estiloStatusVt, labelCarteira, labelStatusVt } from "../../lib/labels";
import { formatarData } from "../../lib/mask-tools";
import { useAppState } from "../../state/app-state";

export const Route = createFileRoute("/buspay/solicitacoes-vt")({
  component: SolicitacoesVtPage,
});

function SolicitacoesVtPage() {
  const { solicitacoesVt, carteirasUsuario } = useAppState();
  const lista = solicitacoesVt.map((s) => ({
    ...s,
    carteira: carteirasUsuario.find((c) => c.id === s.carteiraId),
  }));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-padding" color="primary">
          <BackButton />
          <h4>Solicitações VT</h4>
          <span className="bp-subtitle">Visualize os detalhes das suas solicitações</span>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <BpChamadaByx pagina="solicitacoes" />
        {lista.length > 0 ? (
          <>
            <div className="m-3">
              <p className="fw-bold h6 m-0">Solicitações Ativação VT:</p>
            </div>
            {lista.map((s) => (
              <IonItem key={s.id} className="bp-text-description p-0 m-0 border-0 w-100" lines="full">
                <IonLabel>
                  <p>{labelCarteira(s.carteira?.enumTipoCarteiraExtratoApp)}</p>
                  <p>{s.carteira?.descricaoExtrato}</p>
                  <p>Data solicitação: {formatarData(s.dataCriacao)}</p>
                  {s.dataAprovacao && <p>Data aprovação: {formatarData(s.dataAprovacao)}</p>}
                  {s.dataReprovacao && <p>Data reprovação: {formatarData(s.dataReprovacao)}</p>}
                  {s.motivoReprovacao && <p>{s.motivoReprovacao}</p>}
                </IonLabel>
                <IonText slot="end" style={estiloStatusVt(s.status)}>
                  {labelStatusVt(s.status)}
                </IonText>
              </IonItem>
            ))}
          </>
        ) : (
          <div className="m-3">
            <div className="d-flex flex-row justify-content-center">
              <span className="material-symbols-outlined text-dark fs-3xl">draft</span>
            </div>
            <p className="fs-sm mb-0 text-center">Não há solicitações de vale transporte registradas para sua conta.</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}
