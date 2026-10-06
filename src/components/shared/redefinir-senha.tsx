import { IonIcon, IonProgressBar } from "@ionic/react";
import { checkmarkCircleOutline, closeCircleOutline, eyeOffOutline, eyeOutline } from "ionicons/icons";
import { useState } from "react";
import "./redefinir-senha.scss";

export function RedefinirSenha({ onChange }: { onChange: (senha: string, valido: boolean) => void }) {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const avaliar = (nova: string, conf: string) => {
    const minLength = nova.length >= 6;
    const pattern = /[A-Za-z]/.test(nova) && /\d/.test(nova);
    const iguais = nova.length > 0 && nova === conf;
    onChange(nova, minLength && pattern && iguais);
  };

  const minLength = senha.length >= 6;
  const pattern = /[A-Za-z]/.test(senha) && /\d/.test(senha);
  const iguais = senha.length > 0 && senha === confirmacao;
  const valido = minLength && pattern && iguais;
  const progresso = [minLength, pattern, iguais].filter(Boolean).length / 3;

  const regra = (ok: boolean, texto: string) => (
    <span className={ok ? "valido" : "invalido"}>
      {texto} <IonIcon icon={ok ? checkmarkCircleOutline : closeCircleOutline} />
    </span>
  );

  return (
    <form className="form-group" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="novaSenha" className="bp-label">
        Nova Senha:
      </label>
      <div className="input-group mb-3" style={{ marginBottom: 0 }}>
        <input
          id="novaSenha"
          type={mostrarSenha ? "text" : "password"}
          placeholder="Digite sua nova senha"
          className="form-control bp-input-password"
          value={senha}
          onChange={(e) => {
            setSenha(e.target.value);
            avaliar(e.target.value, confirmacao);
          }}
        />
        <span className="bp-input-button" onClick={() => setMostrarSenha((v) => !v)}>
          <IonIcon icon={mostrarSenha ? eyeOutline : eyeOffOutline} />
        </span>
      </div>
      <label className="bp-label" htmlFor="confirmacaoNovaSenha">
        Confirmar nova Senha:
      </label>
      <div className="input-group mb-3" style={{ marginBottom: 0 }}>
        <input
          id="confirmacaoNovaSenha"
          type={mostrarConfirmacao ? "text" : "password"}
          placeholder="Confirme sua nova senha"
          className="form-control bp-input-password"
          value={confirmacao}
          onChange={(e) => {
            setConfirmacao(e.target.value);
            avaliar(senha, e.target.value);
          }}
        />
        <span className="bp-input-button" onClick={() => setMostrarConfirmacao((v) => !v)}>
          <IonIcon icon={mostrarConfirmacao ? eyeOutline : eyeOffOutline} />
        </span>
      </div>
      <p className="bp-label">
        Sua senha deve conter:
        <br />
        {regra(minLength, "No mínimo 6 caracteres")}
        <br />
        {regra(pattern, "Letras e números")}
        <br />
        {regra(iguais, "Nova senha e confirmação devem bater")}
      </p>
      <IonProgressBar value={progresso} color={valido ? "success" : "danger"} />
    </form>
  );
}
