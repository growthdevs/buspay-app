import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonText, IonToolbar } from "@ionic/react";
import { cardOutline, createOutline, star, starOutline, trashOutline } from "ionicons/icons";

import type { CartaoCredito } from "../../core/models";
import { iconeBandeira } from "../../lib/cartoes";
import type { DismissFn } from "../../lib/modal";
import { useModal } from "../../lib/modal";
import { overlayService } from "../../lib/overlay";
import { useAppState } from "../../state/app-state";
import { PagamentoCartao } from "../recarga/pagamento-cartao";
import "./cartoes.scss";

export function BandeiraCartao({ cartao }: { cartao: CartaoCredito }) {
  const icone = iconeBandeira(cartao.bandeira);
  return icone ? <img className="cartao-bandeira" src={icone} alt="" /> : <IonIcon className="cartao-bandeira" icon={cardOutline} />;
}

/** Modal "Meus cartões" acessado pelo perfil. */
export function MeusCartoes({ dismiss }: { dismiss: DismissFn }) {
  const { present } = useModal();
  const { cartoes, excluirCartao, definirFavorito } = useAppState();

  const abrirFormulario = (cartao?: CartaoCredito) =>
    present((f) => <PagamentoCartao dismiss={f} {...(cartao ? { cartao } : {})} />, { backdropDismiss: false, cssClass: "modal-fullscreen" });

  const excluir = (cartao: CartaoCredito) =>
    overlayService.alert({
      header: "Excluir cartão",
      message: `Deseja excluir o cartão final ${cartao.ultimos4}?`,
      buttons: [
        { text: "Cancelar", role: "cancel", cssClass: "btn-alert-secundario" },
        {
          text: "Excluir",
          cssClass: "btn-alert-primario",
          handler: () => {
            excluirCartao(cartao.id);
            overlayService.toast({ message: "Cartão excluído.", duration: 2500 });
          },
        },
      ],
    });

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className="ion-padding pb-0 bp-toolbar-bg">
          <div className="safe-area-top" />
          <IonText className="ion-text-end">
            <p onClick={() => dismiss()} className="btn-close-modal m-0 fw-bold">X</p>
          </IonText>
          <h1 className="fw-bold">Meus cartões</h1>
          <p className="small-font-text pb-3 mb-0">
            Cartões disponíveis para recarga somente nos municípios que aceitam pagamento com cartão de crédito.
          </p>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {cartoes.length === 0 ? (
          <div className="cartoes-vazio">
            <IonIcon icon={cardOutline} />
            <h2>Nenhum cartão cadastrado</h2>
            <p>Cadastre um cartão de crédito para agilizar suas recargas.</p>
          </div>
        ) : (
          <IonList className="cartoes-lista" lines="full">
            {cartoes.map((c) => (
              <IonItem key={c.id} className="cartao-item">
                <BandeiraCartao cartao={c} />
                <IonLabel>
                  <div className="cartao-numero">**** {c.ultimos4}</div>
                  {c.apelido && <div className="cartao-apelido">{c.apelido}</div>}
                </IonLabel>
                <IonButton fill="clear" aria-label={c.favorito ? "Cartão favorito" : "Definir como favorito"} onClick={() => definirFavorito(c.id)}>
                  <IonIcon slot="icon-only" icon={c.favorito ? star : starOutline} className={`cartao-estrela ${c.favorito ? "is-favorito" : ""}`} />
                </IonButton>
                <IonButton fill="clear" color="primary" aria-label="Editar cartão" onClick={() => abrirFormulario(c)}>
                  <IonIcon slot="icon-only" icon={createOutline} />
                </IonButton>
                <IonButton fill="clear" color="danger" aria-label="Excluir cartão" onClick={() => excluir(c)}>
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
        <div className="ion-padding">
          <IonButton expand="block" color="primary" className="bp-btn-primary" onClick={() => abrirFormulario()}>
            Adicionar cartão
          </IonButton>
        </div>
      </IonContent>
    </>
  );
}
