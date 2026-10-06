import { IonButton, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonRadio, IonRadioGroup, IonText, IonToolbar } from "@ionic/react";
import { addCircleOutline, star } from "ionicons/icons";
import { useState } from "react";

import { formatarMoeda } from "../../lib/mask-tools";
import type { DismissFn } from "../../lib/modal";
import { useModal } from "../../lib/modal";
import { delay } from "../../lib/native";
import { overlayService } from "../../lib/overlay";
import { useAppState } from "../../state/app-state";
import { BandeiraCartao } from "../cartoes/meus-cartoes";
import { PagamentoCartao } from "./pagamento-cartao";
import "../cartoes/cartoes.scss";
import "./selecao-pagamento.scss";

/** Lista os cartões salvos na recarga; pré-seleciona o favorito (ou o primeiro). */
export function SelecionarCartao({ dismiss, tipoRecarga, valor }: { dismiss: DismissFn; tipoRecarga: "C" | "E"; valor: number }) {
  const { present } = useModal();
  const { cartoes } = useAppState();
  const inicial = cartoes.find((c) => c.favorito) ?? cartoes[0];
  const [selecionado, setSelecionado] = useState<number | undefined>(inicial?.id);
  const atual = cartoes.find((c) => c.id === selecionado) ? selecionado : (cartoes.find((c) => c.favorito) ?? cartoes[0])?.id;

  const pagar = async () => {
    const loading = await overlayService.loading(undefined, "Processando pagamento...");
    await delay(900);
    await loading.dismiss();
    dismiss("sucesso");
  };

  const adicionar = async () => {
    const ret = await present((f) => <PagamentoCartao dismiss={f} recarga={{ tipoRecarga, valor }} />, {
      backdropDismiss: false,
      cssClass: "modal-fullscreen",
    });
    if (ret.data === "alterarPagamento") return dismiss("alterarPagamento");
    const salvo = (ret.data as { cartao?: { id: number } } | undefined)?.cartao;
    if (salvo) {
      setSelecionado(salvo.id);
      await pagar();
    }
  };

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className={`ion-padding pb-0 item${tipoRecarga}`}>
          <div className="safe-area-top" />
          <IonText className="ion-text-end">
            <p onClick={() => dismiss()} className="btn-close-modal m-0 fw-bold">X</p>
          </IonText>
          <h1 className="fw-bold">
            Cartão de <br /> crédito
          </h1>
          <p className="small-font-text pt-3 mb-0">Selecione o cartão que deseja usar nesta recarga.</p>
        </IonToolbar>
      </IonHeader>
      <div className="ion-padding px-4 d-flex">
        <IonCol size="4">
          <p className="small-font-text mb-0">Carteira</p>
          <span className="fw-bold">{tipoRecarga === "C" ? "Comum" : "Estudante"}</span>
        </IonCol>
        <IonCol size="5">
          <p className="small-font-text mb-0">Valor da recarga</p>
          <span className="fw-bold">{formatarMoeda(valor)}</span>
        </IonCol>
        <IonCol size="3">
          <p className="mb-0 btn-alterar text-decoration-underline" onClick={() => dismiss("alterarPagamento")}>
            Alterar
          </p>
        </IonCol>
      </div>
      <IonContent>
        <IonRadioGroup value={atual} onIonChange={(e) => setSelecionado(e.detail.value as number)}>
          <IonList className="cartoes-lista" lines="full">
            {cartoes.map((c) => (
              <IonItem key={c.id} className="cartao-item">
                <IonRadio slot="start" value={c.id} aria-label={`Cartão final ${c.ultimos4}`} />
                <BandeiraCartao cartao={c} />
                <IonLabel>
                  <div className="cartao-numero">**** {c.ultimos4}</div>
                  {c.apelido && <div className="cartao-apelido">{c.apelido}</div>}
                </IonLabel>
                {c.favorito && <IonIcon slot="end" icon={star} className="cartao-estrela is-favorito" aria-label="Favorito" />}
              </IonItem>
            ))}
            <IonItem button detail={false} onClick={adicionar} className="cartao-item">
              <IonIcon slot="start" icon={addCircleOutline} color="primary" />
              <IonLabel color="primary" className="fw-bold">Adicionar cartão de crédito</IonLabel>
            </IonItem>
          </IonList>
        </IonRadioGroup>
        <div className="ion-padding">
          <IonButton expand="block" color="primary" className="btn-avc" disabled={atual === undefined} onClick={pagar}>
            Pagar {formatarMoeda(valor)}
          </IonButton>
          <IonButton expand="block" fill="clear" color="medium" onClick={() => dismiss()}>
            Cancelar
          </IonButton>
        </div>
      </IonContent>
    </>
  );
}
