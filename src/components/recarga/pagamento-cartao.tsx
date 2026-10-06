import { IonButton, IonCol, IonContent, IonHeader, IonInput, IonText, IonToggle, IonToolbar } from "@ionic/react";
import { useState } from "react";

import type { CartaoCredito } from "../../core/models";
import { detectarBandeira, iconeBandeira, numeroMascarado } from "../../lib/cartoes";
import { aplicarMascaraCartaoPadrao, aplicarMascaraCartaoCvv, aplicarMascaraCartaoValidade, formatarMoeda } from "../../lib/mask-tools";
import type { DismissFn } from "../../lib/modal";
import { delay } from "../../lib/native";
import { overlayService } from "../../lib/overlay";
import { useAppState } from "../../state/app-state";
import "./selecao-pagamento.scss";

/**
 * Formulário de cartão de crédito, usado tanto no perfil (cadastro/edição) quanto
 * na recarga. Sempre salva o cartão; ao salvar, fecha com `{ cartao }`.
 */
export function PagamentoCartao({
  dismiss,
  cartao,
  recarga,
}: {
  dismiss: DismissFn;
  /** Quando informado, abre em modo de edição (só apelido e favorito mudam). */
  cartao?: CartaoCredito;
  /** Contexto de recarga: exibe carteira e valor no topo. */
  recarga?: { tipoRecarga: "C" | "E"; valor: number };
}) {
  const { salvarCartao, cartoes } = useAppState();
  const edicao = !!cartao;
  const [numero, setNumero] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [nome, setNome] = useState(cartao?.nomeImpresso ?? "");
  const [apelido, setApelido] = useState(cartao?.apelido ?? "");
  const [favorito, setFavorito] = useState(cartao?.favorito ?? cartoes.length === 0);

  const bandeira = edicao ? cartao.bandeira : detectarBandeira(numero);
  const valido = edicao || (numero.replace(/\D/g, "").length >= 14 && validade.length === 5 && cvv.length >= 3 && nome.trim().length > 3);
  const tipo = recarga?.tipoRecarga ?? "C";

  const salvar = async () => {
    const loading = await overlayService.loading(undefined, "Salvando cartão...");
    await delay(700);
    const salvo = salvarCartao({
      ...(cartao ? { id: cartao.id } : {}),
      ...(bandeira !== undefined ? { bandeira } : {}),
      ultimos4: cartao?.ultimos4 ?? numero.replace(/\D/g, "").slice(-4),
      nomeImpresso: (cartao?.nomeImpresso ?? nome).trim().toUpperCase(),
      validade: cartao?.validade ?? validade,
      ...(apelido.trim() ? { apelido: apelido.trim().slice(0, 30) } : {}),
      favorito,
    });
    await loading.dismiss();
    if (!recarga) await overlayService.toast({ message: edicao ? "Cartão alterado com sucesso." : "Cartão salvo com sucesso.", color: "success", duration: 2500 });
    dismiss({ cartao: salvo });
  };

  const icone = iconeBandeira(bandeira);

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className={`ion-padding pb-0 item${tipo}`}>
          <div className="safe-area-top" />
          <IonText className="ion-text-end">
            <p onClick={() => dismiss()} className="btn-close-modal m-0 fw-bold">
              X
            </p>
          </IonText>
          <div>
            <h1 className="fw-bold">
              {edicao ? "Alterar" : "Cadastrar"} <br /> cartão de crédito
            </h1>
            <p className="small-font-text pt-3 mb-0">
              {edicao
                ? "Você pode alterar o apelido e definir este cartão como favorito."
                : "O cartão ficará salvo para recargas nos municípios que aceitam cartão de crédito."}
            </p>
          </div>
        </IonToolbar>
      </IonHeader>
      {recarga && (
        <div className="ion-padding px-4 d-flex">
          <IonCol size="4">
            <p className="small-font-text mb-0">Carteira</p>
            <span className="fw-bold">{tipo === "C" ? "Comum" : "Estudante"}</span>
          </IonCol>
          <IonCol size="5">
            <p className="small-font-text mb-0">Valor da recarga</p>
            <span className="fw-bold">{formatarMoeda(recarga.valor)}</span>
          </IonCol>
          <IonCol size="3">
            <p className="mb-0 btn-alterar text-decoration-underline" onClick={() => dismiss("alterarPagamento")}>
              Alterar
            </p>
          </IonCol>
        </div>
      )}
      <IonContent className="ion-padding">
        <div className="px-2 cartao-form">
          <div className="cartao-preview">
            <div className="cartao-preview-bandeira">{icone && <img src={icone} alt="" />}</div>
            <div className="cartao-preview-numero">
              {edicao ? numeroMascarado(cartao.ultimos4) : numero || "0000 0000 0000 0000"}
            </div>
            <div className="cartao-preview-rodape">
              <div>
                <small>NOME DO TITULAR</small>
                <span>{(edicao ? cartao.nomeImpresso : nome).toUpperCase() || " "}</span>
              </div>
              <div className="text-end">
                <small>VALIDADE</small>
                <span>{edicao ? "**/**" : validade || "mm/aa"}</span>
              </div>
            </div>
          </div>

          <IonInput
            label="Número do cartão"
            labelPlacement="stacked"
            fill="outline"
            placeholder="xxxx xxxx xxxx xxxx"
            inputMode="numeric"
            disabled={edicao}
            value={edicao ? numeroMascarado(cartao.ultimos4) : numero}
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
                disabled={edicao}
                value={edicao ? "**/**" : validade}
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
                disabled={edicao}
                value={edicao ? "***" : cvv}
                onIonInput={(e) => setCvv(aplicarMascaraCartaoCvv(String(e.detail.value ?? "")))}
              />
            </div>
          </div>
          <IonInput
            label="Nome impresso no cartão"
            labelPlacement="stacked"
            fill="outline"
            disabled={edicao}
            maxlength={60}
            value={nome}
            onIonInput={(e) => setNome(String(e.detail.value ?? ""))}
          />
          <IonInput
            className="mt-4"
            label="Apelido do cartão (opcional)"
            labelPlacement="stacked"
            fill="outline"
            placeholder="Ex.: Cartão pessoal"
            maxlength={30}
            value={apelido}
            onIonInput={(e) => setApelido(String(e.detail.value ?? ""))}
          />
          <div className="cartao-favorito mt-4">
            <IonToggle justify="space-between" checked={favorito} onIonChange={(e) => setFavorito(e.detail.checked)}>
              Definir como cartão favorito
            </IonToggle>
          </div>
          <IonButton expand="block" color="primary" className="btn-avc mt-4" disabled={!valido} onClick={salvar}>
            {recarga ? `Salvar e pagar ${formatarMoeda(recarga.valor)}` : "Salvar cartão"}
          </IonButton>
          <IonButton expand="block" fill="clear" color="medium" onClick={() => dismiss()}>
            Cancelar
          </IonButton>
        </div>
      </IonContent>
    </>
  );
}
