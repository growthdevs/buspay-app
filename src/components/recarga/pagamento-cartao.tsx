import { IonButton, IonCol, IonContent, IonHeader, IonInput, IonText, IonToolbar } from "@ionic/react";
import { useState } from "react";

import { aplicarMascaraCartaoPadrao, aplicarMascaraCartaoCvv, aplicarMascaraCartaoValidade, formatarMoeda } from "../../lib/mask-tools";
import type { DismissFn } from "../../lib/modal";
import { delay } from "../../lib/native";
import { overlayService } from "../../lib/overlay";
import "./selecao-pagamento.scss";

export function PagamentoCartao({
  dismiss,
  tipoRecarga,
  valor,
}: {
  dismiss: DismissFn;
  tipoRecarga: "C" | "E";
  valor: number;
}) {
  const [numero, setNumero] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [nome, setNome] = useState("");
  const valido = numero.replace(/\D/g, "").length >= 14 && validade.length === 5 && cvv.length >= 3 && nome.length > 3;

  const pagar = async () => {
    const loading = await overlayService.loading(undefined, "Processando pagamento...");
    await delay(900);
    await loading.dismiss();
    dismiss("sucesso");
  };

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className={`ion-padding pb-0 item${tipoRecarga}`}>
          <div className="safe-area-top" />
          <IonText className="ion-text-end">
            <p onClick={() => dismiss()} className="btn-close-modal m-0 fw-bold">
              X
            </p>
          </IonText>
          <div>
            <h1 className="fw-bold">
              Informações <br /> do cartão
            </h1>
            <p className="small-font-text pt-3 mb-0">
              Informe os dados do cartão de crédito para realizar o pagamento da recarga.
            </p>
          </div>
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
      <IonContent className="ion-padding">
        <div className="px-2">
          <IonInput
            label="Número do cartão"
            labelPlacement="stacked"
            fill="outline"
            placeholder="xxxx xxxx xxxx xxxx"
            inputMode="numeric"
            value={numero}
            onIonInput={(e) => setNumero(aplicarMascaraCartaoPadrao(String(e.detail.value ?? "")))}
          />
          <div className="row my-4 py-2">
            <div className="col-6">
              <IonInput
                label="Data de validade"
                labelPlacement="stacked"
                fill="outline"
                placeholder="mm/aa"
                inputMode="numeric"
                value={validade}
                onIonInput={(e) => setValidade(aplicarMascaraCartaoValidade(String(e.detail.value ?? "")))}
              />
            </div>
            <div className="col-6">
              <IonInput
                label="CVV"
                labelPlacement="stacked"
                fill="outline"
                placeholder="***"
                inputMode="numeric"
                value={cvv}
                onIonInput={(e) => setCvv(aplicarMascaraCartaoCvv(String(e.detail.value ?? "")))}
              />
            </div>
          </div>
          <IonInput
            label="Nome impresso no cartão"
            labelPlacement="stacked"
            fill="outline"
            value={nome}
            onIonInput={(e) => setNome(String(e.detail.value ?? ""))}
          />
          <IonButton expand="block" color="primary" className="btn-avc mt-4" disabled={!valido} onClick={pagar}>
            Pagar {formatarMoeda(valor)}
          </IonButton>
        </div>
      </IonContent>
    </>
  );
}
