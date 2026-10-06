import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonRow, IonText, IonToolbar } from "@ionic/react";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { useState } from "react";

import type { Praca } from "../../core/models";
import { formatarMoeda } from "../../lib/mask-tools";
import type { DismissFn } from "../../lib/modal";
import { useModal } from "../../lib/modal";
import { overlayService } from "../../lib/overlay";
import { valoresRecargaSugeridos } from "../../mocks/data";
import { CompraRealizada } from "./compra-realizada";
import { PagamentoCartao } from "./pagamento-cartao";
import { PagamentoPix } from "./pagamento-pix";
import "./selecao-pagamento.scss";

export function SelecaoPagamento({
  dismiss,
  tipoRecarga,
  saldoAtual,
  praca,
}: {
  dismiss: DismissFn;
  tipoRecarga: "C" | "E";
  saldoAtual: number;
  praca?: Praca;
}) {
  const { present } = useModal();
  const [mostrarSaldo, setMostrarSaldo] = useState(true);
  const [valor, setValor] = useState(0);
  const [metodo, setMetodo] = useState<"pix" | "cartao" | null>(null);
  const minimo = praca?.recargaMinimas.find((r) => (metodo === "pix" ? r.formaTipoPagamentoId === 2 : r.formaTipoPagamentoId === 1))?.valor ?? 5;
  const abaixoMinimo = valor > 0 && valor < minimo;
  const title = tipoRecarga === "C" ? "Comum" : "Estudante";

  const avancar = async () => {
    if (!metodo || !valor || abaixoMinimo) return;
    if (metodo === "pix") {
      await present((fechar) => <PagamentoPix dismiss={fechar} tipoRecarga={tipoRecarga} valor={valor} />);
      dismiss("ok");
    } else {
      const ret = await present((fechar) => (
        <PagamentoCartao dismiss={fechar} tipoRecarga={tipoRecarga} valor={valor} />
      ));
      if (ret.data === "sucesso") {
        await present((fechar) => (
          <CompraRealizada dismiss={fechar} sucesso valor={valor} tipoCarteira={title} />
        ));
        dismiss("ok");
      }
    }
  };

  const aplicarMascara = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    const cents = Number(digits || "0") / 100;
    setValor(cents);
  };

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className={`ion-padding pb-0 item${tipoRecarga}`}>
          <div className="safe-area-top" />
          <IonText className="ion-text-end">
            <p onClick={() => dismiss()} className="btn-close-modal text-white m-0 fw-bold">
              X
            </p>
          </IonText>
          <div>
            <span>Recarga</span>
            <h1>
              <b>{title}</b>
            </h1>
          </div>
        </IonToolbar>
      </IonHeader>
      <div className={`ion-padding item${tipoRecarga} border-saldo-atual-${tipoRecarga} texto-saldo-total d-flex justify-content-between align-items-center`}>
        <span className="fw-bold">saldo atual: {mostrarSaldo ? formatarMoeda(saldoAtual) : "R$ * * * *"}</span>
        <span className="pe-3" onClick={() => setMostrarSaldo((v) => !v)}>
          <IonIcon className="eye-saldo" icon={mostrarSaldo ? eyeOutline : eyeOffOutline} />
        </span>
      </div>
      <IonContent>
        <div className="ion-padding ion-margin">
          <h2>
            <b>Quanto você deseja recarregar?</b>
          </h2>
          <input
            id="inputValor"
            placeholder="R$ 0,00"
            className={`text-saldo Saldo${tipoRecarga}`}
            value={valor ? formatarMoeda(valor) : ""}
            onChange={(e) => aplicarMascara(e.target.value)}
            inputMode="numeric"
          />
          <p className="small-font-text">
            Valor mínimo de <b>{formatarMoeda(minimo)}</b> para recarga.
          </p>
          <div className="d-flex flex-wrap gap-2 my-2">
            {valoresRecargaSugeridos.map((v) => (
              <IonButton key={v} fill="outline" size="small" onClick={() => setValor(v)}>
                {formatarMoeda(v)}
              </IonButton>
            ))}
          </div>
          <div className="faixa-separadora" />
          <h6 className="mt-4">
            <b>Selecione a forma de pagamento</b>
          </h6>
          <IonGrid>
            <IonRow>
              <IonCol
                size="5"
                className={`${metodo === "pix" ? `botao-forma-pagamento-selecionado btn-pagamento-fundo-${tipoRecarga}` : "botao-forma-pagamento"}`}
                onClick={() => setMetodo("pix")}
              >
                <div className="p-3">
                  <p className="small-font-text m-0">PIX</p>
                </div>
              </IonCol>
              <IonCol
                size="5"
                className={`${metodo === "cartao" ? `botao-forma-pagamento-selecionado btn-pagamento-fundo-${tipoRecarga}` : "botao-forma-pagamento"}`}
                onClick={() => setMetodo("cartao")}
              >
                <div className="p-3">
                  <p className="small-font-text mb-0">Cartão de crédito</p>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
        <div className="container">
          <IonButton
            onClick={avancar}
            expand="block"
            color="primary"
            className="btn-avc"
            disabled={!metodo || !valor || abaixoMinimo}
          >
            Avançar
          </IonButton>
          <IonButton onClick={() => dismiss()} expand="block" className="btn-cancel" fill="clear">
            Cancelar recarga
          </IonButton>
        </div>
      </IonContent>
    </>
  );
}
