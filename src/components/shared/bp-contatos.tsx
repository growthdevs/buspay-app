import {
  IonCol,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonRow,
  IonText,
  IonToolbar,
} from "@ionic/react";

import type { DismissFn } from "../../lib/modal";
import { abrirNavegador } from "../../lib/native";
import { BpChamadaByx } from "./bp-chamada-byx";

export function BpContatos({ dismiss }: { dismiss: DismissFn }) {
  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar color="contract">
          <div className="safe-area-top" />
          <div>
            <span className="ion-padding-start" onClick={() => dismiss()}>
              {" "}
              X{" "}
            </span>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow className="ion-padding">
          <h3>Fale com a gente.</h3>
          <p>
            Caso você precise alterar seus dados pessoais (nome, cpf ou data de nascimento), ou tenha alguma dúvida
            sobre o App Buspay, entre em contato conosco por meio dos canais de atendimento abaixo:
          </p>
        </IonRow>
        <div className="w-100">
          <BpChamadaByx pagina="contato" />
        </div>
        <IonRow className="item-header-accordion">
          <IonCol>
            <IonItem lines="none" className="item-header-accordion">
              <img slot="start" src="/assets/images/perfil/icone-tel-perfil.svg" alt="" />
              <IonLabel>Central de Atendimento:</IonLabel>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow className="ion-padding-bottom">
          <IonCol>
            <IonItem lines="none">
              <IonText>
                <p>
                  <a href="tel:08001010777">0800 1010 777</a>
                </p>
                <p>De segunda-feira à sábado das 8h às 20h</p>
              </IonText>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow className="item-header-accordion">
          <IonCol>
            <IonItem lines="none" className="item-header-accordion">
              <img slot="start" src="/assets/images/perfil/icone-whats-perfil.svg" alt="" />
              <IonLabel>WhatsApp:</IonLabel>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow className="ion-padding-bottom">
          <IonCol>
            <IonItem lines="none">
              <IonText>
                <p>
                  <a
                    href="javascript:void(0)"
                    className="link-primary"
                    onClick={() => abrirNavegador("https://wa.me/5508001010777")}
                  >
                    0800 1010 777
                  </a>
                </p>
                <p>De segunda-feira à sábado das 8h às 20h</p>
              </IonText>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow className="item-header-accordion">
          <IonCol>
            <IonItem lines="none" className="item-header-accordion">
              <img slot="start" src="/assets/images/perfil/icone-email-perfil.svg" alt="" />
              <IonLabel>E-mail:</IonLabel>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonItem lines="none">
              <IonText>
                <p>
                  <a href="mailto:buspay@buspay.com.br">buspay@buspay.com.br</a>
                </p>
              </IonText>
            </IonItem>
          </IonCol>
        </IonRow>
      </IonContent>
    </>
  );
}
