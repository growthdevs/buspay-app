import { IonButton, IonContent, IonHeader, IonIcon, IonToolbar } from "@ionic/react";
import { cardOutline, eyeOffOutline, eyeOutline } from "ionicons/icons";
import { useState } from "react";

import type { Praca } from "../../core/models";
import { formatarMoeda } from "../../lib/mask-tools";
import type { DismissFn } from "../../lib/modal";
import { useModal } from "../../lib/modal";
import { CompraRealizada } from "./compra-realizada";
import { SelecionarCartao } from "./selecionar-cartao";
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
        <SelecionarCartao dismiss={fechar} tipoRecarga={tipoRecarga} valor={valor} />
      ), { backdropDismiss: false, cssClass: "modal-fullscreen" });
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
    <div className={`recarga-selecao recarga-selecao-${tipoRecarga}`}>
      <IonHeader className="ion-no-border recarga-selecao-header">
        <IonToolbar className="recarga-selecao-toolbar">
          <div className="safe-area-top" />
          <IonButton fill="clear" className="recarga-selecao-close" aria-label="Fechar recarga" onClick={() => dismiss()}>
            <span aria-hidden="true">X</span>
          </IonButton>
          <div className="recarga-selecao-title">
            <span>Recarga</span>
            <h1>{title}</h1>
          </div>
        </IonToolbar>
        <div className="recarga-selecao-balance">
          <span>saldo atual: {mostrarSaldo ? formatarMoeda(saldoAtual) : "R$ * * * *"}</span>
          <IonButton fill="clear" aria-label={mostrarSaldo ? "Ocultar saldo" : "Mostrar saldo"} onClick={() => setMostrarSaldo((v) => !v)}>
            <IonIcon slot="icon-only" icon={mostrarSaldo ? eyeOutline : eyeOffOutline} />
          </IonButton>
        </div>
      </IonHeader>
      <IonContent className="recarga-selecao-content">
        <div className="recarga-selecao-body">
        <section className="recarga-selecao-amount">
          <h2>Quanto você deseja recarregar?</h2>
          <input
            id="inputValor"
            aria-label="Valor da recarga"
            placeholder="R$ 0,00"
            className="recarga-selecao-value"
            value={valor ? formatarMoeda(valor) : ""}
            onChange={(e) => aplicarMascara(e.target.value)}
            inputMode="numeric"
          />
          {abaixoMinimo && <p className="recarga-selecao-minimum" role="alert">
            Valor mínimo de <b>{formatarMoeda(minimo)}</b> para recarga.
          </p>}
        </section>
        <section className="recarga-selecao-payment">
          <h3>Selecione a forma de pagamento</h3>
          <div className="recarga-selecao-methods">
              <IonButton
                fill="clear"
                aria-pressed={metodo === "pix"}
                className={`recarga-selecao-method ${metodo === "pix" ? "is-selected" : ""}`}
                onClick={() => setMetodo("pix")}
              >
                <span className="recarga-selecao-method-label">
                  <img src="/assets/icon/pix.png" alt="" />
                  <span>PIX</span>
                </span>
              </IonButton>
              <IonButton
                fill="clear"
                aria-pressed={metodo === "cartao"}
                className={`recarga-selecao-method ${metodo === "cartao" ? "is-selected" : ""}`}
                onClick={() => setMetodo("cartao")}
              >
                <span className="recarga-selecao-method-label">
                  <IonIcon icon={cardOutline} />
                  <span>Cartão de<br />crédito</span>
                </span>
              </IonButton>
          </div>
        </section>
        <div className="recarga-selecao-actions">
          <IonButton
            onClick={avancar}
            expand="block"
            color="primary"
            className="recarga-selecao-next"
            disabled={!metodo || !valor || abaixoMinimo}
          >
            Avançar
          </IonButton>
          <IonButton onClick={() => dismiss()} expand="block" className="recarga-selecao-cancel" fill="clear">
            Cancelar recarga
          </IonButton>
        </div>
        </div>
      </IonContent>
    </div>
  );
}
