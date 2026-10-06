import {
  IonContent,
  IonHeader,
  IonImg,
  IonLabel,
  IonList,
  IonListHeader,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { useNavigate } from "@tanstack/react-router";

import { NotificacaoTipoEnum, SituacaoNotificacaoEnum } from "../../core/enums";
import type { Notificacao } from "../../core/models";
import { formatarDataHora } from "../../lib/mask-tools";
import type { DismissFn } from "../../lib/modal";
import { iconeNotificacao } from "../../lib/labels";
import { overlayService } from "../../lib/overlay";
import { useAppState } from "../../state/app-state";
import "./bp-notificacoes.scss";

export function BpNotificacoes({ dismiss }: { dismiss: DismissFn }) {
  const navigate = useNavigate();
  const { notificacoesRecebidas, marcarNotificacoesComoVisualizadas } = useAppState();
  const recentes = notificacoesRecebidas.listaNotificacoesUltimos7Dias ?? [];
  const antigas = notificacoesRecebidas.listaNotificacoesDemaisDias ?? [];
  const vazio = recentes.length === 0 && antigas.length === 0;

  const redirecionar = (tipo?: NotificacaoTipoEnum) => {
    dismiss();
    if (tipo === NotificacaoTipoEnum.beneficio) navigate({ to: "/buspay/beneficio" });
    else if (tipo === NotificacaoTipoEnum.credito || tipo === NotificacaoTipoEnum.debito) {
      navigate({ to: "/buspay/extrato" });
    }
  };

  const lista = (itens: Notificacao[], mostrarPonto: boolean) =>
    itens.map((not, i) => (
      <div key={`${not.titulo}-${i}`} className="row notificacoes-item" onClick={() => redirecionar(not.tipo)}>
        <div className="d-flex flex-row align-items-center">
          {mostrarPonto && not.situacao !== SituacaoNotificacaoEnum.visualizada && (
            <div className="d-flex flex-column">
              <div className="dot-novas-notificacoes" />
            </div>
          )}
          <div className="d-flex flex-column">
            <div style={{ marginLeft: 10 }}>
              <IonImg src={iconeNotificacao(not.tipo)} />
            </div>
          </div>
          <div className="d-flex flex-column">
            <p className="notificacoes-item-titulo">{not.titulo}</p>
          </div>
        </div>
        <div className="d-flex flex-row">
          <div className="d-flex flex-column">
            <p className="notificacoes-item-mensagem">
              {not.mensagem}
              <br />
              {formatarDataHora(not.dataHoraEnvio)}
            </p>
          </div>
        </div>
      </div>
    ));

  return (
    <>
      <IonHeader>
        <IonToolbar className="notificacoes-toolbar ion-padding">
          <div className="safe-area-top" />
          <div>
            <IonText className="ion-text-end">
              <p onClick={() => dismiss()}>X</p>
            </IonText>
            <h3 className="notificacoes-titulo">Notificações</h3>
            <p className="notificacoes-subtitulo">Confira as mensagens que enviamos para você.</p>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (e) => {
            marcarNotificacoesComoVisualizadas();
            await overlayService.toast({ message: "Notificações atualizadas.", color: "success", duration: 1500 });
            e.detail.complete();
          }}
        >
          <IonRefresherContent />
        </IonRefresher>
        {vazio && (
          <div className="ion-padding">
            <p className="nenhum-registro-title">Nada por aqui.</p>
            <p className="nenhum-registro-text">
              Assim que chegar alguma notificação, você poderá conferir nesse canal, ou arraste para baixo para
              atualizar as notificações.
            </p>
          </div>
        )}
        {recentes.length > 0 && (
          <IonList className="p-0">
            <IonListHeader className="item-header-accordion">
              <IonLabel className="notificacoes-list-header">Últimos 7 dias</IonLabel>
            </IonListHeader>
            {lista(recentes, true)}
          </IonList>
        )}
        {antigas.length > 0 && (
          <IonList className="p-0">
            <IonListHeader className="item-header-accordion">
              <IonLabel className="notificacoes-list-header">Mais antigas</IonLabel>
            </IonListHeader>
            {lista(antigas, false)}
          </IonList>
        )}
      </IonContent>
    </>
  );
}
