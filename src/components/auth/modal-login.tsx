import { IonButton, IonContent, IonGrid, IonIcon, IonImg, IonNote, IonRow } from "@ionic/react";
import { closeOutline, eyeOffOutline, eyeOutline } from "ionicons/icons";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import type { DismissFn } from "../../lib/modal";
import { useModal } from "../../lib/modal";
import { aplicarMascaraCpf, cpfValido } from "../../lib/mask-tools";
import { overlayService } from "../../lib/overlay";
import { useAppState } from "../../state/app-state";
import { ModalSolicitarRecuperacao } from "./modal-solicitar-recuperacao";
import "./modal-login.scss";

/** Porte de `pages/auth/modal-login/modal-login.component.*`. */
export function ModalLogin({ dismiss, conectado }: { dismiss: DismissFn; conectado: boolean }) {
  const navigate = useNavigate();
  const { present } = useModal();
  const { entrar } = useAppState();

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [cpfTocado, setCpfTocado] = useState(false);
  const [senhaTocada, setSenhaTocada] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const cpfInvalido = !cpfValido(cpf.replace(/\D/g, ""));
  const senhaInvalida = senha.length < 4;
  const formValido = !cpfInvalido && !senhaInvalida;

  const recuperarSenha = () => {
    present((fechar) => <ModalSolicitarRecuperacao dismiss={fechar} />, {
      backdropDismiss: false,
    });
  };

  const submeter = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!formValido) {
      await overlayService.toast({ message: "Login e/ou senha inválido" });
      return;
    }

    const loading = await overlayService.loading();
    // Mock: nenhuma chamada ao Cognito/API, apenas o atraso para manter a mesma percepção de uso.
    await new Promise((resolve) => setTimeout(resolve, 600));
    await loading.dismiss();

    entrar();
    dismiss();
    navigate({ to: "/buspay/home" });
  };

  return (
    <IonContent className="ion-padding modal-login">
      <div className="safe-area-top" />
      <IonGrid>
        <IonRow>
          <IonIcon
            icon={closeOutline}
            color="primary"
            style={{ zoom: 1.7 }}
            onClick={() => dismiss()}
          />
        </IonRow>

        <IonRow>
          <IonImg src="/assets/images/shared/LOGO_AZUL.svg" alt="Buspay" className="bg-logo-modal" />
        </IonRow>
      </IonGrid>
      <br />

      {conectado ? (
        <IonRow>
          <span className="label-titulo">Faça seu Login</span>
          <br />
          <span className="label-descricao">
            Informe seu<b> CPF e senha.</b> Caso tenha esquecido sua senha,{" "}
            <span style={{ color: "var(--ion-color-primary)" }} onClick={recuperarSenha}>
              <b>clique aqui.</b>
            </span>
          </span>
        </IonRow>
      ) : (
        <IonRow>
          <span className="label-titulo">Você está Offline.</span>
          <br />
          <span className="label-descricao">
            Mas não se preocupe. Você pode gerar um QR code para pagamento da sua passagem. Para
            isso, informe seu CPF e senha de acesso.
          </span>
        </IonRow>
      )}
      <br />

      <form onSubmit={submeter}>
        <label className="bp-label" htmlFor="cpf">
          CPF:
        </label>
        <input
          id="cpf"
          type="text"
          inputMode="numeric"
          className="form-control bp-input"
          placeholder="123.456.789-10"
          value={cpf}
          onChange={(e) => setCpf(aplicarMascaraCpf(e.target.value))}
          onBlur={() => setCpfTocado(true)}
        />
        {cpfTocado && cpfInvalido && (
          <IonRow>
            <IonNote className="validation-error" color="danger">
              Informe um CPF válido*
            </IonNote>
          </IonRow>
        )}

        <label htmlFor="senha" className="bp-label">
          Senha:
        </label>
        <div className="input-group mb-3" style={{ marginBottom: "0px !important" }}>
          <input
            id="senha"
            type={mostrarSenha ? "text" : "password"}
            placeholder="Digite sua nova senha"
            className="form-control bp-input-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onBlur={() => setSenhaTocada(true)}
          />
          <span className="bp-input-button" onClick={() => setMostrarSenha((v) => !v)}>
            <IonIcon icon={mostrarSenha ? eyeOutline : eyeOffOutline} />
          </span>
        </div>
        {senhaTocada && senha.length === 0 && (
          <IonRow>
            <IonNote className="validation-error" color="danger">
              A senha é obrigatória*
            </IonNote>
          </IonRow>
        )}
        <br />
        <IonButton
          type="submit"
          expand="block"
          color="primary"
          className="btn-entrar"
          disabled={!formValido}
        >
          {conectado ? "Entrar" : "Gerar QR code offline"}
        </IonButton>
      </form>
      <br />
      <br />

      {conectado && (
        <IonRow>
          <span className="label-descricao" style={{ margin: "auto" }}>
            Ainda não possui uma conta?{" "}
            <span
              style={{ color: "var(--ion-color-primary)" }}
              onClick={() => {
                dismiss();
                navigate({ to: "/auth/cadastro-inicial" });
              }}
            >
              <b>Cadastre-se</b>
            </span>
          </span>
        </IonRow>
      )}
    </IonContent>
  );
}
