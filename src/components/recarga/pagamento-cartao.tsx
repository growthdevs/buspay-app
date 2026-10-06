import { IonButton, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonText, IonToggle, IonToolbar } from "@ionic/react";
import { cardOutline } from "ionicons/icons";
import { useRef, useState } from "react";

import type { CartaoCredito } from "../../core/models";
import { detectarBandeira, iconeBandeira, numeroMascarado } from "../../lib/cartoes";
import { camposCepFaltantes, consultarCepMock, type CepEndereco } from "../../lib/cep";
import {
  aplicarMascaraCartaoCvv,
  aplicarMascaraCartaoPadrao,
  aplicarMascaraCartaoValidade,
  aplicarMascaraCep,
  formatarMoeda,
  removerMask,
} from "../../lib/mask-tools";
import type { DismissFn } from "../../lib/modal";
import { delay } from "../../lib/native";
import { overlayService } from "../../lib/overlay";
import { useAppState } from "../../state/app-state";
import "../cartoes/cartoes.scss";
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
  const [cep, setCep] = useState(cartao?.cepCobranca ?? "");
  const [logradouro, setLogradouro] = useState(cartao?.logradouroCobranca ?? "");
  const [bairro, setBairro] = useState(cartao?.bairroCobranca ?? "");
  const [cidade, setCidade] = useState(cartao?.cidadeCobranca ?? "");
  const [consultandoCep, setConsultandoCep] = useState(false);
  const [cepEncontrado, setCepEncontrado] = useState(!!cartao?.cepCobranca);
  const [exibirLogradouro, setExibirLogradouro] = useState(false);
  const [exibirBairro, setExibirBairro] = useState(false);
  const [exibirCidade, setExibirCidade] = useState(false);
  const [cepSemEnderecoCompleto, setCepSemEnderecoCompleto] = useState(false);
  const cepConsultado = useRef("");
  const consultaSeq = useRef(0);
  const enderecoCep = useRef<CepEndereco | undefined>(undefined);

  const bandeira = edicao ? cartao.bandeira : detectarBandeira(numero);
  const enderecoManualOk =
    (!exibirLogradouro || logradouro.trim().length > 0) &&
    (!exibirBairro || bairro.trim().length > 0) &&
    (!exibirCidade || cidade.trim().length > 0);
  const cepOk = edicao || (cepEncontrado && !consultandoCep && removerMask(cep).length === 8 && enderecoManualOk);
  const valido =
    cepOk && (edicao || (numero.replace(/\D/g, "").length >= 14 && validade.length === 5 && cvv.length >= 3 && nome.trim().length > 3));
  const tipo = recarga?.tipoRecarga ?? "C";

  const limparConsultaCep = () => {
    cepConsultado.current = "";
    enderecoCep.current = undefined;
    setConsultandoCep(false);
    setCepEncontrado(false);
    setExibirLogradouro(false);
    setExibirBairro(false);
    setExibirCidade(false);
    setCepSemEnderecoCompleto(false);
    setLogradouro("");
    setBairro("");
    setCidade("");
  };

  const aoDigitarCep = async (raw: string) => {
    const mascarado = aplicarMascaraCep(raw);
    setCep(mascarado);
    const digits = removerMask(mascarado);
    if (digits.length !== 8) {
      consultaSeq.current += 1;
      limparConsultaCep();
      return;
    }
    if (digits === cepConsultado.current) return;

    const seq = ++consultaSeq.current;
    cepConsultado.current = digits;
    setConsultandoCep(true);
    setCepEncontrado(false);
    enderecoCep.current = undefined;
    setExibirLogradouro(false);
    setExibirBairro(false);
    setExibirCidade(false);
    setCepSemEnderecoCompleto(false);

    const loading = await overlayService.loading({ message: "Consultando CEP..." });
    try {
      const endereco = await consultarCepMock(digits);
      if (seq !== consultaSeq.current) return;
      if (endereco.erro) {
        cepConsultado.current = "";
        setCepEncontrado(false);
        await overlayService.toast({ message: "O cep informado não retornou um endereço válido.", duration: 5000 });
        return;
      }
      enderecoCep.current = endereco;
      const faltantes = camposCepFaltantes(endereco);
      setExibirLogradouro(faltantes.logradouro);
      setExibirBairro(faltantes.bairro);
      setExibirCidade(faltantes.cidade);
      setCepSemEnderecoCompleto(faltantes.logradouro || faltantes.bairro || faltantes.cidade);
      setLogradouro(faltantes.logradouro ? "" : endereco.logradouro);
      setBairro(faltantes.bairro ? "" : endereco.bairro);
      setCidade(faltantes.cidade ? "" : endereco.localidade);
      setCepEncontrado(true);
    } finally {
      if (seq === consultaSeq.current) setConsultandoCep(false);
      await loading.dismiss();
    }
  };

  const salvar = async () => {
    if (!valido) return;
    const loading = await overlayService.loading({ message: "Salvando cartão..." });
    await delay(700);
    const endereco = enderecoCep.current;
    const salvo = salvarCartao({
      ...(cartao ? { id: cartao.id } : {}),
      ...(bandeira !== undefined ? { bandeira } : {}),
      ultimos4: cartao?.ultimos4 ?? numero.replace(/\D/g, "").slice(-4),
      nomeImpresso: (cartao?.nomeImpresso ?? nome).trim().toUpperCase(),
      validade: cartao?.validade ?? validade,
      ...(apelido.trim() ? { apelido: apelido.trim().slice(0, 30) } : {}),
      favorito,
      cepCobranca: cartao?.cepCobranca ?? cep,
      logradouroCobranca: cartao?.logradouroCobranca ?? (exibirLogradouro ? logradouro.trim() : endereco?.logradouro ?? logradouro),
      bairroCobranca: cartao?.bairroCobranca ?? (exibirBairro ? bairro.trim() : endereco?.bairro ?? bairro),
      cidadeCobranca: cartao?.cidadeCobranca ?? (exibirCidade ? cidade.trim() : endereco?.localidade ?? cidade),
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
          <div className="my-4">
            <IonInput
              label="Número do cartão"
              labelPlacement="stacked"
              fill="outline"
              placeholder="xxxx xxxx xxxx xxxx"
              inputMode="numeric"
              disabled={edicao}
              value={edicao ? numeroMascarado(cartao.ultimos4) : numero}
              onIonInput={(e) => setNumero(aplicarMascaraCartaoPadrao(String(e.detail.value ?? "")))}
            >
              {icone ? (
                <IonImg slot="end" src={icone} alt="" className="icone-bandeira-cartao" />
              ) : (
                <IonIcon slot="end" icon={cardOutline} className="icone-cartao-padrao" />
              )}
            </IonInput>
          </div>
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
            label="CEP da fatura"
            labelPlacement="stacked"
            fill="outline"
            placeholder="00000-000"
            inputMode="numeric"
            disabled={edicao}
            value={cep}
            onIonInput={(e) => {
              if (!edicao) void aoDigitarCep(String(e.detail.value ?? ""));
            }}
          />
          {cepSemEnderecoCompleto && (
            <p className="mensagem-cep-incompleto">O CEP não retornou o endereço completo. Preencha os campos abaixo.</p>
          )}
          {exibirLogradouro && (
            <IonInput
              className="mt-3"
              label="Endereço (Logradouro)"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Endereço"
              value={logradouro}
              onIonInput={(e) => setLogradouro(String(e.detail.value ?? ""))}
            />
          )}
          {exibirBairro && (
            <IonInput
              className="mt-3"
              label="Bairro"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Bairro"
              value={bairro}
              onIonInput={(e) => setBairro(String(e.detail.value ?? ""))}
            />
          )}
          {exibirCidade && (
            <IonInput
              className="mt-3"
              label="Cidade"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Cidade"
              value={cidade}
              onIonInput={(e) => setCidade(String(e.detail.value ?? ""))}
            />
          )}
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
