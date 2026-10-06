import {
  IonAccordion,
  IonAccordionGroup,
  IonAvatar,
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { chevronForwardOutline, documentTextOutline } from "ionicons/icons";
import { useNavigate } from "@tanstack/react-router";

import type { DismissFn } from "../../lib/modal";
import { useModal } from "../../lib/modal";
import { overlayService } from "../../lib/overlay";
import { abrirNavegador, compartilhar } from "../../lib/native";
import { nomeApresentacaoCompleto } from "../../lib/nome-tools";
import { contratosAdesaoMock, termoUsoConteudoMock, versaoAppMock } from "../../mocks/data";
import { useAppState } from "../../state/app-state";
import { BpChamadaByx } from "./bp-chamada-byx";
import { BpContatos } from "./bp-contatos";
import { BpNotificacoes } from "./bp-notificacoes";
import { BpTermoCompleto } from "./bp-termo-completo";
import "./bp-menu.scss";

export function BpMenu({ dismiss }: { dismiss: DismissFn }) {
  const navigate = useNavigate();
  const { present } = useModal();
  const { dadosUsuario, sair } = useAppState();
  const fotoAvatar = dadosUsuario.fotoPerfilUrl || dadosUsuario.documentos.find((d) => d.url)?.url;

  const ir = (to: string) => {
    dismiss();
    navigate({ to });
  };

  const sairDaConta = async () => {
    await overlayService.alert({
      header: "Sair da conta",
      message: "Deseja realmente sair do aplicativo?",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Sair",
          handler: () => {
            sair();
            dismiss();
            navigate({ to: "/auth" });
          },
        },
      ],
    });
  };

  return (
    <>
      <IonHeader>
        <IonToolbar className="bp-toolbar-bg ion-padding">
          <IonText className="d-flex flex-row justify-content-end px-2 pt-2 w-100">
            <span className="fw-bold fs-xl py-2 text-white" role="button" onClick={() => dismiss()}>
              X
            </span>
          </IonText>
          <IonRow className="mb-4">
            <IonCol size="3" className="p-0 d-flex align-items-center">
              <IonAvatar className="w-100 h-100 ratio ratio-1x1">
                <img
                  className="w-100 h-100 object-fit-cover"
                  src={fotoAvatar || "/assets/images/perfil/avatar-sem-foto.svg"}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/assets/images/perfil/avatar-sem-foto.svg";
                  }}
                  alt=""
                />
              </IonAvatar>
            </IonCol>
            <IonCol size="9" className="menu-padding-nome">
              <IonRow>
                <p className="menu-saudacao">{nomeApresentacaoCompleto(dadosUsuario.nomeSocial, dadosUsuario.nome)}</p>
              </IonRow>
              <IonRow>
                <IonButton className="btn-perfil" fill="outline" onClick={() => ir("/buspay/perfil")}>
                  Meu Perfil
                </IonButton>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <BpChamadaByx pagina="menu" />
        <IonList className="menu-list" lines="none">
          <IonItem className="menu-item-border" onClick={() => ir("/buspay/ajuda")}>
            <IonImg className="menu-icones" slot="start" src="/assets/icon/bp-menu/help.svg" />
            Ajuda
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonItem>
          <IonItem
            className="menu-item-border"
            onClick={() => present((fechar) => <BpContatos dismiss={fechar} />)}
          >
            <IonImg className="menu-icones" slot="start" src="/assets/icon/bp-menu/support_agent.svg" />
            Contato
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonItem>
          <IonItem
            className="menu-item-border"
            onClick={() =>
              present((fechar) => <BpNotificacoes dismiss={fechar} />, { cssClass: "modal-fullscreen" })
            }
          >
            <IonImg className="menu-icones" slot="start" src="/assets/icon/bp-menu/notifications.svg" />
            Notificações
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonItem>
          <IonItem className="menu-item-border" onClick={() => ir("/buspay/beneficio")}>
            <IonImg className="menu-icones" slot="start" src="/assets/icon/bp-menu/meus_beneficio.svg" />
            Meus Benefícios
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonItem>
          <IonItem className="menu-item-border" onClick={() => ir("/buspay/tarifas")}>
            <IonImg className="menu-icones" slot="start" src="/assets/icon/bp-menu/assignment_turned_in.svg" />
            Tarifas
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonItem>
          <IonItem className="menu-item-border" onClick={() => ir("/buspay/solicitacoes-vt")}>
            <IonImg className="menu-icones" slot="start" src="/assets/icon/bp-menu/solicitacoes.svg" />
            Solicitações
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonItem>
          <IonItem className="menu-item-border" onClick={() => ir("/buspay/localizar-onibus")}>
            <IonImg className="menu-icones" slot="start" src="/assets/icon/bp-menu/directions_bus.svg" />
            Localizar ônibus
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonItem>
          <IonItem className="menu-item-border" onClick={() => ir("/buspay/pontos-de-recarga")}>
            <IonImg className="menu-icones" slot="start" src="/assets/icon/bp-menu/location_on.svg" />
            Pontos de recarga
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonItem>
          <IonItem
            className="menu-item-border"
            onClick={() =>
              compartilhar({
                title: "Buspay",
                text: "Baixe o aplicativo Buspay e pague sua passagem pelo celular.",
                url: "https://www.buspay.com.br",
              })
            }
          >
            <IonImg className="menu-icones" slot="start" src="/assets/icon/bp-menu/groups.svg" />
            Indique a BUSPAY
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonItem>
          <IonItem className="menu-item-border" onClick={sairDaConta}>
            <IonImg className="menu-icones" slot="start" src="/assets/icon/bp-menu/logout.svg" />
            Sair
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonItem>
          <IonAccordionGroup>
            <IonAccordion value="termos-condicoes">
              <IonItem className="menu-item-border" slot="header" lines="none">
                <IonIcon icon={documentTextOutline} slot="start" color="primary" className="menu-icones" />
                Termos e condições
              </IonItem>
              <div slot="content">
                {contratosAdesaoMock.map((termo) => (
                  <IonItem
                    key={termo.id}
                    className="menu-item-border"
                    button
                    lines="none"
                    onClick={() =>
                      present((fechar) => (
                        <BpTermoCompleto
                          dismiss={fechar}
                          titulo={termo.descricaoTipo}
                          conteudo={termoUsoConteudoMock}
                        />
                      ))
                    }
                  >
                    <IonLabel className="ps-4">{termo.descricaoTipo}</IonLabel>
                    <IonIcon icon={chevronForwardOutline} slot="end" />
                  </IonItem>
                ))}
                <IonItem
                  className="menu-item-border"
                  button
                  lines="none"
                  onClick={() => abrirNavegador("https://www.buspay.com.br/termos")}
                >
                  <IonLabel className="ps-4">Abrir no navegador</IonLabel>
                  <IonIcon icon={chevronForwardOutline} slot="end" />
                </IonItem>
              </div>
            </IonAccordion>
          </IonAccordionGroup>
        </IonList>
      </IonContent>
      <IonFooter className="ion-no-border mb-4">
        <IonRow className="lower-content versao-app">
          <p style={{ fontSize: 12, color: "#ccc", placeContent: "center" }}>Versão {versaoAppMock}</p>
        </IonRow>
        <div className="safe-area-bottom" />
      </IonFooter>
    </>
  );
}
