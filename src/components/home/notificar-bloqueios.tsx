import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonList,
  IonText,
  IonToolbar,
} from "@ionic/react";

import type { ContaBloqueio } from "../../core/models";
import { formatarDataHora } from "../../lib/mask-tools";
import type { DismissFn } from "../../lib/modal";
import { useModal } from "../../lib/modal";
import { BILHETADORAS } from "../../mocks/data";
import { BpContatos } from "../shared/bp-contatos";
import "../shared/bp-notificacoes.scss";

export function NotificarBloqueios({
  dismiss,
  bloqueios,
}: {
  dismiss: DismissFn;
  bloqueios: ContaBloqueio[];
}) {
  const { present } = useModal();
  return (
    <>
      <IonHeader>
        <IonToolbar className="notificacoes-toolbar ion-padding">
          <div className="safe-area-top" />
          <div>
            <IonText className="ion-text-end">
              <p onClick={() => dismiss()}>X</p>
            </IonText>
            <h3 className="notificacoes-titulo">Notificações de bloqueio</h3>
            <p className="notificacoes-subtitulo">
              Você possui bloqueios em sua conta. <br />
              Para mais informações,{" "}
              <u onClick={() => present((f) => <BpContatos dismiss={f} />)}>
                <b>clique aqui</b>
              </u>{" "}
              e fale conosco.
            </p>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {bloqueios.filter((b) => b.bloqueado).map((bloqueio, i) => (
            <IonCard mode="md" key={i}>
              <IonCardHeader className="mb-2">
                <IonCardTitle className="notificacoes-titulo">
                  {BILHETADORAS.find((b) => b.id === bloqueio.bilhetadora.id)?.nome ?? bloqueio.bilhetadora.nome}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText className="notificacoes-subtitulo">
                  Data: {formatarDataHora(bloqueio.dataBloqueio)} <br />
                  Motivo: {bloqueio.motivo}
                </IonText>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </>
  );
}
