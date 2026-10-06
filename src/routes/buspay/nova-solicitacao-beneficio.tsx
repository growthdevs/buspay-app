import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonToolbar } from "@ionic/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { BackButton } from "../../components/shared/back-button";
import { BpChamadaByx } from "../../components/shared/bp-chamada-byx";
import { iconeBeneficio } from "../../lib/labels";
import { overlayService } from "../../lib/overlay";
import { delay, tirarFotoMock } from "../../lib/native";
import { regrasBeneficioMock } from "../../mocks/data";
import { useAppState } from "../../state/app-state";

export const Route = createFileRoute("/buspay/nova-solicitacao-beneficio")({
  component: NovaSolicitacaoPage,
});

function NovaSolicitacaoPage() {
  const navigate = useNavigate();
  const { setSolicitacoesBeneficio, solicitacoesBeneficio } = useAppState();
  const [selecionada, setSelecionada] = useState<number | null>(null);

  const enviar = async () => {
    const regra = regrasBeneficioMock.find((r) => r.id === selecionada);
    if (!regra) return;
    await tirarFotoMock();
    const loading = await overlayService.loading(undefined, "Enviando solicitação...");
    await delay(700);
    await loading.dismiss();
    setSolicitacoesBeneficio([
      {
        id: Date.now(),
        contaId: 10542,
        regraBeneficio: regra,
        statusSolicitacao: 1,
        ativo: true,
        nomeRegraBeneficio: regra.nome,
        statusSolicitacaoTexto: "Em análise",
        atribuicaoBeneficio: null,
        dataSolicitacao: new Date().toISOString(),
        ultimaSolicitacaoRenovacao: null,
      },
      ...solicitacoesBeneficio,
    ]);
    await overlayService.toast({ message: "Solicitação enviada para análise.", color: "success" });
    navigate({ to: "/buspay/beneficio" });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-padding" color="primary">
          <BackButton href="/buspay/beneficio" />
          <h4>Nova solicitação</h4>
          <span className="bp-subtitle">Escolha o tipo de benefício e anexe os documentos (simulado).</span>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <BpChamadaByx pagina="beneficio" />
        <IonList>
          {regrasBeneficioMock.map((regra) => (
            <IonItem key={regra.id} button onClick={() => setSelecionada(regra.id)}>
              <img slot="start" src={`/assets/icon/${iconeBeneficio(regra.beneficioTipoId)}`} width={24} height={24} alt="" />
              <IonLabel>
                <h2>{regra.nome}</h2>
                <p>{regra.textoInformativo}</p>
              </IonLabel>
              {selecionada === regra.id && <IonLabel slot="end">✓</IonLabel>}
            </IonItem>
          ))}
        </IonList>
        <div className="ion-padding">
          <IonButton expand="block" className="bp-btn-primary" disabled={!selecionada} onClick={enviar}>
            Enviar solicitação
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
