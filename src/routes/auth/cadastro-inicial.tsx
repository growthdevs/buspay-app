import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonNote, IonPage, IonProgressBar, IonRow, IonText } from "@ionic/react";
import { chevronDownOutline } from "ionicons/icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { BpAlert } from "../../components/shared/bp-alert";
import { BpTermoCompleto } from "../../components/shared/bp-termo-completo";
import { RedefinirSenha } from "../../components/shared/redefinir-senha";
import { BpAlertTypeEnum } from "../../core/enums";
import { aplicarMascaraCelular, aplicarMascaraCpf, aplicarMascaraNome, cpfValido } from "../../lib/mask-tools";
import { nomeApresentacao } from "../../lib/nome-tools";
import { useModal } from "../../lib/modal";
import { delay, tirarFotoMock } from "../../lib/native";
import { overlayService } from "../../lib/overlay";
import { contratosAdesaoMock, pracasMock, termoUsoConteudoMock } from "../../mocks/data";
import { useAppState } from "../../state/app-state";
import "./cadastro-inicial.scss";

export const Route = createFileRoute("/auth/cadastro-inicial")({
  component: CadastroInicialPage,
});

const ETAPAS = ["Dados pessoais", "Contato", "Senha", "Selfie", "Termos"];

function CadastroInicialPage() {
  const navigate = useNavigate();
  const { present } = useModal();
  const { entrar, setDadosUsuario, dadosUsuario } = useAppState();
  const [etapa, setEtapa] = useState(1);
  const [nome, setNome] = useState("");
  const [nomeSocial, setNomeSocial] = useState("");
  const [cpf, setCpf] = useState("");
  const [bilhetadoraId, setBilhetadoraId] = useState(String(pracasMock[0]?.bilhetadora.id ?? 1));
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [formaEnvio, setFormaEnvio] = useState("");
  const [, setSenha] = useState("");
  const [senhaOk, setSenhaOk] = useState(false);
  const [selfie, setSelfie] = useState("");
  const [aceite, setAceite] = useState(false);
  const [novidades, setNovidades] = useState(false);
  const [tocado, setTocado] = useState<Record<string, boolean>>({});

  const progresso = etapa / 5;
  const nomeApresentado = nomeApresentacao(nomeSocial, nome);

  const pessoaisOk = nome.trim().split(" ").length >= 2 && cpfValido(cpf.replace(/\D/g, "")) && !!bilhetadoraId;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const celularOk = celular.replace(/\D/g, "").length === 11;
  const contatoOk = emailOk && celularOk && !!formaEnvio;

  const sair = () =>
    overlayService.alert({
      header: "Cancelar cadastro",
      message: "Deseja sair do cadastro? Os dados preenchidos serão perdidos.",
      buttons: [
        { text: "Continuar cadastro", role: "cancel" },
        { text: "Sair", handler: () => navigate({ to: "/auth" }) },
      ],
    });

  const finalizar = async () => {
    const loading = await overlayService.loading(undefined, "Criando sua conta...");
    await delay(800);
    setDadosUsuario({
      ...dadosUsuario,
      nome: nome.toUpperCase(),
      nomeSocial,
      cpf: cpf.replace(/\D/g, ""),
      email,
      celular: `+55${celular.replace(/\D/g, "")}`,
      bilhetadoraId: Number(bilhetadoraId),
      aceiteTermosDeUsoBuspay: aceite,
    });
    await loading.dismiss();
    const ret = await present((fechar) => (
      <BpAlert
        dismiss={fechar}
        alertType={BpAlertTypeEnum.cadastroInicial}
        titulo={`Pronto, ${nomeApresentado}!`}
        mensagem="Sua conta foi criada. Agora é só entrar e começar a usar a Buspay."
        labelBotao="Fazer login"
      />
    ));
    if (ret.data) {
      entrar();
      navigate({ to: "/buspay/home" });
    } else {
      navigate({ to: "/auth" });
    }
  };

  return (
    <IonPage>
      <IonContent className="cadastro-card-align ion-padding">
        <div className="safe-area-top" />
        <IonRow className="arrow-voltar">
          <IonIcon icon={chevronDownOutline} onClick={sair} />
        </IonRow>
        <IonRow className="ion-padding">
          <label className="pb-3">
            <span className="progresso">Passo {etapa} de 5: </span>
            <span className="etapa-atual">{ETAPAS[etapa - 1]}</span>
          </label>
          <IonProgressBar className="barra-progresso" value={progresso} color="primary" />
        </IonRow>

        {etapa === 1 && (
          <div className="bp-padding">
            <h1 className="cadastro-title">
              Bem-vindo(a) à <b>Buspay</b>
            </h1>
            <p className="cadastro-subtitle">
              Vamos criar a sua conta. É bem rapidinho. =)
              <br />
              Para começar, informe seus <b className="text-primary">dados pessoais.</b>
            </p>
            <label className="bp-label">Nome Completo (Conforme documento)</label>
            <input className="form-control bp-input" value={nome} onChange={(e) => setNome(aplicarMascaraNome(e.target.value))} onBlur={() => setTocado((t) => ({ ...t, nome: true }))} />
            {tocado["nome"] && nome.trim().split(" ").length < 2 && <IonNote color="danger">Campo obrigatório*</IonNote>}
            <label className="bp-label">Nome Social (Opcional)</label>
            <input className="form-control bp-input" value={nomeSocial} onChange={(e) => setNomeSocial(aplicarMascaraNome(e.target.value))} />
            <label className="bp-label">CPF</label>
            <input className="form-control bp-input" placeholder="000.000.000-00" inputMode="numeric" value={cpf} onChange={(e) => setCpf(aplicarMascaraCpf(e.target.value))} onBlur={() => setTocado((t) => ({ ...t, cpf: true }))} />
            {tocado["cpf"] && !cpfValido(cpf.replace(/\D/g, "")) && <IonNote color="danger">Informe um CPF válido*</IonNote>}
            <label className="bp-label">Localidade / Praça de uso</label>
            <select className="form-control bp-input" value={bilhetadoraId} onChange={(e) => setBilhetadoraId(e.target.value)}>
              {pracasMock.map((p) => (
                <option key={p.id} value={p.bilhetadora.id}>
                  {p.cidade.nome} - {p.cidade.estado?.sigla}
                </option>
              ))}
            </select>
            <IonButton className="botao-avancar cadastro-ion-button" disabled={!pessoaisOk} onClick={() => setEtapa(2)}>
              Avançar
            </IonButton>
            <IonText className="btn-voltar" color="primary" onClick={sair}>
              <p>Cancelar Cadastro</p>
            </IonText>
          </div>
        )}

        {etapa === 2 && (
          <div className="bp-padding">
            <h1 className="cadastro-title">
              Olá, <b>{nomeApresentado}!</b>
            </h1>
            <p className="cadastro-subtitle">
              Estamos muito felizes de ter você com a gente. Informe seus <b className="text-primary">dados para contato.</b>
            </p>
            <label className="bp-label">E-mail</label>
            <input className="form-control bp-input" type="email" placeholder="ex: buspay@buspay.com.br" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label className="bp-label">DDD + celular (apenas números)</label>
            <input className="form-control bp-input" inputMode="numeric" value={celular} onChange={(e) => setCelular(aplicarMascaraCelular(e.target.value))} />
            <p className="mt-3">
              Usando estes dados, vamos enviar um código de confirmação para <b>proteger sua conta na BUSPAY.</b> Como você prefere receber o código?
            </p>
            <label className="bp-label">Forma de envio *</label>
            <select className="form-control bp-input" value={formaEnvio} onChange={(e) => setFormaEnvio(e.target.value)}>
              <option value="">Selecione uma opção</option>
              <option value="1">SMS</option>
              <option value="2">E-mail</option>
              <option value="3">WhatsApp</option>
            </select>
            <IonButton className="botao-avancar cadastro-ion-button" disabled={!contatoOk} onClick={() => setEtapa(3)}>
              Avançar
            </IonButton>
            <IonText className="btn-voltar" color="primary" onClick={() => setEtapa(1)}>
              <p>Voltar para dados pessoais</p>
            </IonText>
          </div>
        )}

        {etapa === 3 && (
          <div className="bp-padding">
            <h1 className="cadastro-title">
              Quase lá, <b>{nomeApresentado}!</b>
            </h1>
            <p className="cadastro-subtitle">Agora vamos definir sua senha.</p>
            <RedefinirSenha
              onChange={(s, ok) => {
                setSenha(s);
                setSenhaOk(ok);
              }}
            />
            <IonButton className="botao-avancar cadastro-ion-button" disabled={!senhaOk} onClick={() => setEtapa(4)}>
              Avançar
            </IonButton>
            <IonText className="btn-voltar" color="primary" onClick={() => setEtapa(2)}>
              <p>Voltar para contatos</p>
            </IonText>
          </div>
        )}

        {etapa === 4 && (
          <div className="bp-padding">
            <h1 className="cadastro-title">
              Ótimo, <b>{nomeApresentado}!</b>
            </h1>
            <p className="cadastro-subtitle">
              Agora você pode tirar sua selfie para realizar pagamento do transporte público por <b className="text-primary">reconhecimento facial.</b>
              <br />
              <br />
              Caso prefira, você poderá tirar sua selfie mais tarde.
            </p>
            {!selfie ? (
              <>
                <label className="bp-label">Selfie</label>
                <IonButton fill="outline" color="tertiary" expand="block" onClick={async () => setSelfie(await tirarFotoMock())}>
                  Tirar Selfie (Opcional)
                </IonButton>
              </>
            ) : (
              <IonText color="success">
                Selfie enviada
                <span className="label-visualizar-imagem" onClick={() => overlayService.alert({ header: "Selfie", message: "Selfie de demonstração capturada.", buttons: [{ text: "Ok" }] })}>
                  Visualizar
                </span>
              </IonText>
            )}
            <IonButton className="botao-avancar cadastro-ion-button" onClick={() => setEtapa(5)}>
              Avançar
            </IonButton>
            <IonText className="btn-voltar" color="primary" onClick={() => setEtapa(3)}>
              <p>Voltar para definição de senha</p>
            </IonText>
          </div>
        )}

        {etapa === 5 && (
          <div className="bp-padding">
            <h1 className="cadastro-title">
              Vamos finalizar, <b>{nomeApresentado}!</b>
            </h1>
            <p className="cadastro-subtitle">
              Sua identidade foi validada e agora, para finalizar, você deverá <b>ler e (caso esteja de acordo) aceitar nossos termos de uso.</b>
            </p>
            {contratosAdesaoMock.map((termo) => (
              <IonItem
                key={termo.id}
                button
                lines="none"
                className="card-item-termo"
                onClick={() => present((f) => <BpTermoCompleto dismiss={f} titulo={termo.descricaoTipo} conteudo={termoUsoConteudoMock} />)}
              >
                <IonLabel className="ion-text-wrap">
                  <p className="titulo-item-termo">{termo.descricaoTipo}</p>
                  <span className="link-item-termo">Ler</span>
                </IonLabel>
              </IonItem>
            ))}
            <IonItem lines="none" className="div-termos-aceite p-2 pt-4">
              <input className="form-check-input" type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} />
              <label className="bp-label ps-3">
                <b>Declaro que li e concordo</b> com os Termos de Uso listados acima <b>da BUSPAY*</b>
              </label>
            </IonItem>
            <IonItem lines="none" className="p-2">
              <input className="form-check-input" type="checkbox" checked={novidades} onChange={(e) => setNovidades(e.target.checked)} />
              <label className="bp-label ps-3">Desejo receber novidades da BUSPAY e de seus parceiros</label>
            </IonItem>
            <IonButton className="botao-avancar cadastro-ion-button" disabled={!aceite} onClick={finalizar}>
              Finalizar
            </IonButton>
            <IonText className="btn-voltar" color="primary" onClick={() => setEtapa(4)}>
              <p>Voltar para Selfie</p>
            </IonText>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}
