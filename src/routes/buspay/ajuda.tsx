import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSearchbar,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { chevronForwardOutline } from "ionicons/icons";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { BackButton } from "../../components/shared/back-button";
import { BpChamadaByx } from "../../components/shared/bp-chamada-byx";
import { BpContatos } from "../../components/shared/bp-contatos";
import { BpTermoCompleto } from "../../components/shared/bp-termo-completo";
import type { AjudaItem } from "../../core/models";
import { CategoriaIdEnum } from "../../core/enums";
import { useModal } from "../../lib/modal";
import { ajudaMock, termoUsoConteudoMock } from "../../mocks/data";
import "./ajuda.scss";

export const Route = createFileRoute("/buspay/ajuda")({
  component: AjudaPage,
});

function AjudaPage() {
  const { present } = useModal();
  const [busca, setBusca] = useState("");
  const filtradas = useMemo(
    () =>
      ajudaMock.filter((a) =>
        `${a.titulo} ${a.campoPesquisa} ${a.subCategoria.categoria.descricao}`.toLowerCase().includes(busca.toLowerCase()),
      ),
    [busca],
  );
  const top = filtradas.slice(0, 3);

  const abrir = (ajuda: AjudaItem) =>
    present((fechar) => (
      <>
        <IonHeader>
          <IonToolbar className="ion-padding">
            <p className="text-end fw-bold m-0" onClick={() => fechar()}>
              X
            </p>
            <h4>{ajuda.titulo}</h4>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div dangerouslySetInnerHTML={{ __html: ajuda.texto }} />
        </IonContent>
      </>
    ));

  const porCategoria = (id: number) => {
    const itens = ajudaMock.filter((a) => a.subCategoria.categoriaId === id);
    present((fechar) => (
      <>
        <IonHeader>
          <IonToolbar className="ion-padding">
            <p className="text-end fw-bold m-0" onClick={() => fechar()}>
              X
            </p>
            <h4>{id === CategoriaIdEnum.sobreBuspay ? "Sobre a Buspay" : "App Buspay"}</h4>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {itens.map((ajuda) => (
              <IonItem
                key={ajuda.id}
                onClick={() => {
                  fechar();
                  abrir(ajuda);
                }}
              >
                <IonLabel className="ion-text-wrap">{ajuda.titulo}</IonLabel>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </>
    ));
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="ion-padding ajuda-header-bg pb-0">
          <div className="safe-area-top" />
          <BackButton className="header-backbutton-primary" />
          <h2 className="ajuda-title">Ajuda</h2>
          <span className="ajuda-subtitle">
            Estamos aqui para te ajudar =)
            <br />
            Faça uma busca ou navegue pelas opções abaixo.
          </span>
        </IonToolbar>
        <IonToolbar className="px-3 ajuda-header-bg">
          <IonSearchbar
            value={busca}
            onIonInput={(e) => setBusca(String(e.detail.value ?? ""))}
            placeholder="Qual é a sua dúvida?"
          />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <BpChamadaByx pagina="ajuda" />
        <IonRow className="ajuda-subtitle-padding pb-2">
          <IonText color="primary">
            <h6>
              <b>Perguntas Frequentes:</b>
            </h6>
          </IonText>
        </IonRow>
        <IonList>
          {top.map((ajuda) => (
            <IonItem key={ajuda.id} lines="full" onClick={() => abrir(ajuda)}>
              <IonLabel className="ion-text-wrap px-4 pb-2">
                <p className="ajuda-perguntas-titulo">{ajuda.titulo}</p>
                <p className="ajuda-perguntas-categoria mt-2">{ajuda.subCategoria.categoria.descricao}</p>
              </IonLabel>
              <IonIcon icon={chevronForwardOutline} slot="end" />
            </IonItem>
          ))}
          {top.length === 0 && (
            <IonItem>
              <IonLabel className="ion-text-wrap px-4 pb-2">
                <p className="ajuda-perguntas-titulo">
                  <b>Nenhuma dúvida encontrada para a pesquisa.</b>
                </p>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
        <IonRow className="ajuda-subtitle-padding pt-4">
          <IonText color="primary">
            <h6>
              <b>Por categoria:</b>
            </h6>
          </IonText>
        </IonRow>
        <IonList>
          <IonItem lines="full" onClick={() => porCategoria(1)}>
            <IonLabel className="ion-text-wrap px-4 pb-2">
              <p className="ajuda-categoria-titulo">Sobre a Buspay</p>
              <p className="ajuda-categoria-sub">Informações sobre a nossa empresa</p>
            </IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonItem>
          <IonItem lines="full" onClick={() => porCategoria(2)}>
            <IonLabel className="ion-text-wrap px-4 pb-2">
              <p className="ajuda-categoria-titulo">App Buspay</p>
              <p className="ajuda-categoria-sub">Saiba como usar todas as funcionalidades do nosso App</p>
            </IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonItem>
        </IonList>
        <IonItem
          lines="none"
          onClick={() =>
            present((f) => <BpTermoCompleto dismiss={f} titulo="Termos de Uso" conteudo={termoUsoConteudoMock} />)
          }
        >
          <IonLabel className="ion-text-wrap px-4 pb-2 pt-2">
            <p className="ajuda-categoria-titulo">Termos e Políticas de privacidade</p>
            <p className="ajuda-categoria-sub">Confira nossos termos de uso e políticas de privacidade</p>
          </IonLabel>
          <IonIcon icon={chevronForwardOutline} slot="end" />
        </IonItem>
        <div className="p-3">
          <IonButton fill="solid" size="large" expand="full" className="ajuda-btn-text mx-3 mb-4" onClick={() => present((f) => <BpContatos dismiss={f} />)}>
            <span>
              <img src="/assets/icon/dialog.png" className="ajuda-icon" alt="" />
            </span>
            Fale com a gente
          </IonButton>
          <div className="safe-area-bottom" />
        </div>
      </IonContent>
    </IonPage>
  );
}
