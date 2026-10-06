import {
  IonAccordion,
  IonAccordionGroup,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { cameraOutline, cardOutline, helpCircle } from "ionicons/icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { BackButton } from "../../components/shared/back-button";
import { MeusCartoes } from "../../components/cartoes/meus-cartoes";
import { PagamentoCartao } from "../../components/recarga/pagamento-cartao";
import { BpContatos } from "../../components/shared/bp-contatos";
import { aplicarMascaraCpfCnpj, aplicarMascaraNis, esconderDigitosCel, formatarData } from "../../lib/mask-tools";
import { nomeApresentacaoCompleto } from "../../lib/nome-tools";
import { useModal } from "../../lib/modal";
import { abrirNavegador, delay } from "../../lib/native";
import { overlayService } from "../../lib/overlay";
import { useAppState } from "../../state/app-state";
import "../../components/cartoes/cartoes.scss";
import "./perfil.scss";

export const Route = createFileRoute("/buspay/perfil")({
  component: PerfilPage,
});

function PerfilPage() {
  const navigate = useNavigate();
  const { present } = useModal();
  const { dadosUsuario, autenticacaoBiometricaDisponivel, setDadosUsuario, cartoes } = useAppState();
  const [biometria, setBiometria] = useState(true);
  const [push, setPush] = useState(true);
  const foto = dadosUsuario.fotoPerfilUrl || dadosUsuario.documentos.find((d) => d.url)?.url;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <div className="safe-area-top" />
        <BackButton className="header-backbutton-primary" />
        <IonToolbar>
          <IonRow className="ion-padding">
            <IonCol size="3" className="p-0 d-flex align-items-center">
              <IonAvatar className="w-100 h-100 ratio ratio-1x1">
                <img
                  className="w-100 h-100 object-fit-cover"
                  src={foto || "/assets/images/perfil/avatar-sem-foto.svg"}
                  alt=""
                />
              </IonAvatar>
            </IonCol>
            <IonCol className="ion-text-end">
              <IonButton
                className="ion-padding-horizontal menu-botao-tirar-selfie"
                fill="outline"
                color="primary"
                onClick={() => navigate({ to: "/tirar-selfie" })}
              >
                <IonIcon className="pe-2" icon={cameraOutline} />
                Tirar selfie
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow className="ion-padding-horizontal align-items-center">
            <IonCol>
              <h3 className="m-0 text-dark">
                <b>{nomeApresentacaoCompleto(dadosUsuario.nomeSocial, dadosUsuario.nome)}</b>
              </h3>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonAccordionGroup value="dadosPessoais">
          <IonAccordion value="dadosPessoais">
            <IonItem slot="header" className="item-header-accordion">
              <IonLabel>Dados Pessoais</IonLabel>
            </IonItem>
            <IonList slot="content">
              <IonItem>
                <IonLabel className="ion-text-wrap">
                  <p>
                    <b>CPF:</b>
                  </p>
                  <p>{aplicarMascaraCpfCnpj(dadosUsuario.cpf)}</p>
                </IonLabel>
              </IonItem>
              {dadosUsuario.nis && (
                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <p>
                      <b>NIS:</b>
                    </p>
                    <p>{aplicarMascaraNis(dadosUsuario.nis)}</p>
                  </IonLabel>
                  <IonImg className="menu-icones" slot="end" src="/assets/images/perfil/icone-edit-perfil.svg" />
                </IonItem>
              )}
              <IonItem>
                <IonLabel className="ion-text-wrap">
                  <p>
                    <b>Data Nascimento:</b>
                  </p>
                  <p>{dadosUsuario.dataNascimento ? formatarData(dadosUsuario.dataNascimento) : "Não informado"}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel className="ion-text-wrap">
                  <p className="text-black">
                    <a className="btn-link-color fw-bold" onClick={() => present((f) => <BpContatos dismiss={f} />)}>
                      Fale com a gente
                    </a>
                    , caso precise alterar <br /> estes dados
                  </p>
                </IonLabel>
              </IonItem>
              {!dadosUsuario.nis && (
                <IonItem
                  onClick={async () => {
                    const nis = "12345678901";
                    setDadosUsuario({ ...dadosUsuario, nis });
                    await overlayService.toast({ message: "NIS incluído (simulação).", color: "success" });
                  }}
                >
                  <IonLabel>
                    <IonText color="secondary" className="fw-bold">
                      <b>Incluir NIS</b>
                    </IonText>
                  </IonLabel>
                  <IonButtons slot="primary">
                    <IonButton
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        overlayService.alert({
                          header: "O que é NIS?",
                          message: "Número de Identificação Social utilizado em programas sociais.",
                          buttons: [{ text: "Ok" }],
                        });
                      }}
                    >
                      <IonIcon slot="end" size="large" icon={helpCircle} />
                    </IonButton>
                  </IonButtons>
                </IonItem>
              )}
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
        <IonAccordionGroup value="contato">
          <IonAccordion value="contato">
            <IonItem slot="header" className="item-header-accordion">
              <IonLabel>Dados de Contato</IonLabel>
            </IonItem>
            <IonList slot="content">
              <IonItem>
                <IonLabel className="ion-text-wrap">
                  <p>
                    <b>E-mail:</b>
                  </p>
                  <p>{dadosUsuario.email || "Não informado"}</p>
                </IonLabel>
                <IonImg className="menu-icones" slot="end" src="/assets/images/perfil/icone-edit-perfil.svg" />
              </IonItem>
              <IonItem>
                <IonLabel className="ion-text-wrap">
                  <p>
                    <b>Celular:</b>
                  </p>
                  <p>{esconderDigitosCel(dadosUsuario.celular)}</p>
                </IonLabel>
                <IonImg className="menu-icones" slot="end" src="/assets/images/perfil/icone-edit-perfil.svg" />
              </IonItem>
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
        <IonAccordionGroup value="endereco">
          <IonAccordion value="endereco">
            <IonItem slot="header" className="item-header-accordion">
              <IonLabel>Dados de Endereço</IonLabel>
            </IonItem>
            <IonList slot="content">
              <IonItem>
                <IonLabel className="ion-text-wrap">
                  {dadosUsuario.enderecos.map((end) => (
                    <div key={end.id}>
                      <p>
                        <b>Logradouro: </b>
                        {end.logradouro}
                      </p>
                      <p>
                        <b>Número:</b> {end.numero}
                      </p>
                      <p>
                        <b>Complemento:</b> {end.complemento || "Não cadastrado"}
                      </p>
                      <p>
                        <b>Bairro:</b> {end.bairro}
                      </p>
                      <p>
                        <b>Cidade:</b> {end.cidade}
                      </p>
                      <p>
                        <b>Estado:</b> {end.estado}
                      </p>
                      <p>
                        <b>CEP:</b> {end.cep}
                      </p>
                    </div>
                  ))}
                </IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
        <IonAccordionGroup>
          <IonAccordion value="cartoes">
            <IonItem slot="header" className="item-header-accordion">
              <IonLabel>Cartões de Crédito</IonLabel>
            </IonItem>
            <IonList slot="content">
              <IonItem lines="none">
                <IonLabel className="ion-text-wrap">
                  <p className="cartoes-aviso">
                    <IonIcon icon={cardOutline} className="me-1" />
                    Os cartões salvos podem ser usados para recarga <b>somente nos municípios que aceitam pagamento com cartão de crédito</b>.
                  </p>
                </IonLabel>
              </IonItem>
              <IonItem button onClick={() => present((f) => <MeusCartoes dismiss={f} />, { cssClass: "modal-fullscreen" })}>
                <IonText>Meus cartões ({cartoes.length})</IonText>
              </IonItem>
              <IonItem
                button
                onClick={() => present((f) => <PagamentoCartao dismiss={f} />, { backdropDismiss: false, cssClass: "modal-fullscreen" })}
              >
                <IonText>Adicionar cartão</IonText>
              </IonItem>
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
        <IonAccordionGroup>
          <IonAccordion>
            <IonItem slot="header" className="item-header-accordion">
              <IonLabel>Segurança e Privacidade</IonLabel>
            </IonItem>
            <IonList slot="content">
              <IonItem onClick={() => navigate({ to: "/auth/recuperar-senha" })}>
                <IonText>Alterar Senha de Acesso</IonText>
                <IonImg className="menu-icones" slot="end" src="/assets/images/perfil/icone-edit-perfil.svg" />
              </IonItem>
              {autenticacaoBiometricaDisponivel && (
                <IonItem>
                  <IonToggle justify="space-between" checked={biometria} onIonChange={(e) => setBiometria(e.detail.checked)}>
                    Autenticação biométrica
                  </IonToggle>
                </IonItem>
              )}
              <IonItem>
                <IonToggle justify="space-between" checked={push} onIonChange={(e) => setPush(e.detail.checked)}>
                  Notificações push
                </IonToggle>
              </IonItem>
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
        <IonAccordionGroup>
          <IonAccordion>
            <IonItem slot="header" className="item-header-accordion">
              <IonLabel>Outras Informações</IonLabel>
            </IonItem>
            <IonList slot="content">
              <IonItem onClick={() => abrirNavegador("https://www.buspay.com.br/termos")}>
                <IonText>Termos de uso</IonText>
                <IonImg className="menu-icones" slot="end" src="/assets/images/perfil/icone-edit-perfil.svg" />
              </IonItem>
              <IonItem
                onClick={async () => {
                  await overlayService.alert({
                    header: "Encerrar conta",
                    message: "Esta é uma simulação. No app original a conta só é encerrada após validação de saldo e senha.",
                    buttons: [{ text: "Ok" }],
                  });
                  await delay(200);
                }}
              >
                <IonText>Encerrar conta</IonText>
                <IonImg className="menu-icones" slot="end" src="/assets/images/perfil/icone-edit-perfil.svg" />
              </IonItem>
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
}
