import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonText, IonToolbar } from "@ionic/react";

import type { Extrato } from "../../core/models";
import { TipoTransacaoEnum } from "../../core/enums";
import { iconeDetalheExtrato, labelCarteira, labelTipoProcesso, labelTipoTransacao, temaCarteira } from "../../lib/labels";
import { formatarDataHora, formatarMoeda } from "../../lib/mask-tools";
import type { DismissFn } from "../../lib/modal";

export function DetalheExtrato({ dismiss, lancamento }: { dismiss: DismissFn; lancamento: Extrato }) {
  const credito = lancamento.tipoTransacao === TipoTransacaoEnum.credito;
  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className="ion-padding">
          <div className="safe-area-top" />
          <p onClick={() => dismiss()}>X</p>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard className="ion-text-center">
          <img src={`/assets/icon/${iconeDetalheExtrato(lancamento.processoTipo)}.png`} width={90} alt="" />
          <IonCardHeader className="ion-no-padding ion-padding-top">
            <IonCardTitle>
              <b>
                {labelTipoTransacao(lancamento.tipoTransacao)} - {labelTipoProcesso(lancamento.processoTipo)}
              </b>
            </IonCardTitle>
            <IonCardSubtitle className="ion-margin-top">{formatarDataHora(lancamento.dataTransacao ?? lancamento.data)}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent className="ion-no-padding">
            <p style={{ fontSize: 28, fontWeight: 700 }}>
              {credito ? "" : "-"}
              {formatarMoeda(lancamento.valor)}
            </p>
            {lancamento.descricao && (
              <p>
                Descrição:
                <br />
                <b>{lancamento.descricao}</b>
              </p>
            )}
            {lancamento.linha && (
              <p>
                Linha: <b>{lancamento.linha}</b>
              </p>
            )}
            {lancamento.formaPagamento && (
              <p>
                Forma de pagamento: <b>{lancamento.formaPagamento}</b>
              </p>
            )}
          </IonCardContent>
        </IonCard>
        <div className="ion-text-center">
          <span>Carteira:</span>
          <br />
          <IonText className={`item${temaCarteira(lancamento.carteiraTipo)}`}>
            {labelCarteira(lancamento.carteiraTipo)}
          </IonText>
        </div>
      </IonContent>
    </>
  );
}
