import { IonButton, IonItem, IonLabel, IonModal, IonThumbnail } from "@ionic/react";
import { useState } from "react";

import { maiorDeIdade } from "../../lib/date-tools";
import { abrirNavegador } from "../../lib/native";
import { useAppState } from "../../state/app-state";
import "./bp-chamada-byx.scss";

export function BpChamadaByx({ pagina, modalChamada = false }: { pagina: string; modalChamada?: boolean }) {
  const { dadosUsuario } = useAppState();
  const [colapsado, setColapsado] = useState(false);
  const [modalAberto, setModalAberto] = useState(modalChamada && pagina !== "home");

  if (!maiorDeIdade(dadosUsuario.dataNascimento)) return null;

  const abrirSite = (banner: boolean) => {
    const medium = banner ? "modal" : "faixa";
    const campaign = pagina === "home" ? "buspay_home" : "buspay_internas";
    const content = pagina === "home" ? "" : `&utm_content=${pagina}`;
    abrirNavegador(
      `https://www.buscred.com.br/buspay/?utm_source=appbuspay&utm_medium=${medium}&utm_campaign=${campaign}${content}`,
    );
  };

  const conteudoModal = (
    <div className="pb-4 pt-2 bg-byx-menina">
      <div>
        <div className="p-4 d-flex flex-row justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <img src="/assets/images/shared/bp-logo.svg" alt="Buspay" className="d-block" style={{ height: 16, width: "auto" }} />
            <span className="text-white fs-3 fw-light">|</span>
            <img
              src="/assets/images/shared/buscred-logo-v2.svg"
              alt="Buscred"
              className="d-block"
              style={{ height: 23, width: "auto" }}
            />
          </div>
          <p className="text-white fw-bold cursor-pointer m-0" style={{ fontSize: 28 }} onClick={() => setModalAberto(false)}>
            X
          </p>
        </div>
        <div className="flex-grow-1 d-flex flex-column justify-content-center pt-5 px-4">
          <div className="mb-4">
            <h2 className="byx-title">
              <span>O crédito</span>
              <br />
              <span>que você precisa</span>
              <br />
              rápido e sem complicação.
            </h2>
          </div>
        </div>
        <div className="mb-3">
          <IonButton onClick={() => abrirSite(true)} expand="block" className="btn-simular-byx fw-bold">
            Simule aqui
          </IonButton>
        </div>
      </div>
    </div>
  );

  if (pagina === "home") {
    return (
      <div className={`byx-widget ${colapsado ? "byx-collapsed" : ""}`}>
        <div className="byx-card" onClick={() => abrirSite(true)}>
          <div className="byx-logo">
            <img src="/assets/images/shared/buscred-logo.svg" alt="Buscred" className="byx-logo-img" />
          </div>
          <p className="byx-title">
            <span className="byx-highlight">Simule aqui</span>
            <br />
            seu empréstimo
            <br />
            pessoal
          </p>
        </div>
        <div className="byx-tab" onClick={() => setColapsado((v) => !v)}>
          <span className={`byx-close-icon ${colapsado ? "d-none" : ""}`}>✕</span>
          <img
            src="/assets/images/shared/buscred-logo.svg"
            alt="bc"
            className={`byx-tab-logo ${colapsado ? "" : "d-none"}`}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <IonItem onClick={() => abrirSite(false)} className="byx-bg-azul text-center" lines="none">
        <IonLabel>
          <p className="margin-texto-byx mb-0 text-white fw-bold">
            <span className="amarelo-texto-byx">Simule aqui</span> seu empréstimo pessoal.
          </p>
        </IonLabel>
        <IonThumbnail className="icon-thumbnail-byx text-center mt-0 me-1">
          <img alt="buscred-logo" src="/assets/images/shared/buscred-logo.svg" />
        </IonThumbnail>
      </IonItem>
      <IonModal isOpen={modalAberto} backdropDismiss={false} className="modal-byx" onDidDismiss={() => setModalAberto(false)}>
        <div className="d-flex flex-row justify-content-center align-items-center h-100 w-100">{conteudoModal}</div>
      </IonModal>
    </>
  );
}
