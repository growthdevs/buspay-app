import {
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonToolbar,
} from "@ionic/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { BackButton } from "../../components/shared/back-button";
import { BpChamadaByx } from "../../components/shared/bp-chamada-byx";
import { BpPraca } from "../../components/shared/bp-praca";
import { SolicitacaoBeneficioStatusEnum } from "../../core/enums";
import { classeBadgeBeneficio, iconeBeneficio, labelStatusBeneficio } from "../../lib/labels";
import { formatarData } from "../../lib/mask-tools";
import { overlayService } from "../../lib/overlay";
import { delay } from "../../lib/native";
import { useAppState } from "../../state/app-state";
import "./beneficio.scss";

export const Route = createFileRoute("/buspay/beneficio")({
  component: BeneficioPage,
});

function BeneficioPage() {
  const navigate = useNavigate();
  const { solicitacoesBeneficio, atribuicoesBeneficio } = useAppState();
  const emAndamento = solicitacoesBeneficio.filter((s) => s.statusSolicitacao === SolicitacaoBeneficioStatusEnum.pendente);
  const historico = solicitacoesBeneficio[0];
  const ativos = atribuicoesBeneficio.filter((a) => a.ativo);
  const renovacao = solicitacoesBeneficio.find((s) => s.pendenteRenovacao);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-padding" color="primary">
          <BackButton />
          <h4>Benefícios</h4>
          <span className="bp-subtitle">Consulte ou solicite benefício para utilização do transporte público.</span>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <BpChamadaByx pagina="beneficio" />
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (e) => {
            await delay(400);
            await overlayService.toast({ message: "Benefícios atualizados.", color: "success", duration: 1500 });
            e.detail.complete();
          }}
        >
          <IonRefresherContent />
        </IonRefresher>
        <div className="ion-padding">
          <BpPraca />
        </div>

        {emAndamento.length > 0 && historico && (
          <>
            <div className="mx-3 mb-2">
              <p className="fw-bold h6 m-0 mb-2">Histórico de Solicitações:</p>
            </div>
            <hr />
            <div className="beneficio-card mx-3" onClick={() => navigate({ to: "/buspay/nova-solicitacao-beneficio" })}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <IonImg src={`/assets/icon/${iconeBeneficio(historico.regraBeneficio.beneficioTipoId)}`} className="img-status" />
                <span className="fw-bold text-black flex-grow-1">{historico.regraBeneficio.nome}</span>
                <span className={`beneficio-badge rounded-pill flex-shrink-0 ${classeBadgeBeneficio(historico.statusSolicitacao)}`}>
                  {labelStatusBeneficio(historico.statusSolicitacao)}
                </span>
              </div>
              <IonButton expand="block" fill="outline" color="primary">
                Detalhes
              </IonButton>
            </div>
            <hr />
          </>
        )}

        {renovacao && (
          <>
            <div className="mx-3 mb-2">
              <p className="fw-bold h6 m-0 mb-2">Renovação de Benefício:</p>
            </div>
            <hr />
            <div className="beneficio-card mx-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <IonImg src={`/assets/icon/${iconeBeneficio(renovacao.regraBeneficio.beneficioTipoId)}`} className="img-status" />
                <span className="fw-bold text-black flex-grow-1">{renovacao.regraBeneficio.nome}</span>
                <span className={`beneficio-badge rounded-pill flex-shrink-0 ${classeBadgeBeneficio(renovacao.statusSolicitacao)}`}>
                  {labelStatusBeneficio(renovacao.statusSolicitacao)}
                </span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-0 fs-xs fw-bold text-black">Validade</p>
                  <p className="mb-0 fs-sm text-black">{formatarData(renovacao.atribuicaoBeneficio?.dataValidade)}</p>
                </div>
                <IonButton expand="block" fill="outline" color="primary">
                  Detalhes
                </IonButton>
              </div>
            </div>
            <hr />
          </>
        )}

        {ativos.map((beneficio) => (
          <div key={beneficio.id}>
            <div className="mx-3 mb-2">
              <p className="fw-bold h6 m-0 mb-2">Benefício ativo:</p>
            </div>
            <hr />
            <div className="beneficio-card mx-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <IonImg src={`/assets/icon/${iconeBeneficio(beneficio.regraBeneficio.beneficioTipoId)}`} className="img-status" />
                <span className="fw-bold text-black flex-grow-1">{beneficio.regraBeneficio.nome}</span>
                <span className="beneficio-badge rounded-pill badge-ativo flex-shrink-0">Ativo</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-0 fs-xs fw-bold text-black">Validade</p>
                  <p className="mb-0 fs-sm text-black">{formatarData(beneficio.dataValidade)}</p>
                </div>
                <IonButton expand="block" fill="outline" color="primary">
                  Detalhes
                </IonButton>
              </div>
            </div>
            <hr />
          </div>
        ))}

        <IonRow className="beneficio-btn-align">
          <IonButton onClick={() => navigate({ to: "/buspay/nova-solicitacao-beneficio" })} color="primary" className="bp-btn-request mt-4">
            Solicitar um benefício
          </IonButton>
        </IonRow>
        <p className="ion-padding text-obervacao">Observação: Cada cliente poderá ter apenas 1 benefício ativo por município.</p>
      </IonContent>
    </IonPage>
  );
}
