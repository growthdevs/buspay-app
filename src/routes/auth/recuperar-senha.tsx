import { IonButton, IonCard, IonCardContent, IonContent, IonImg, IonPage, IonRow, IonText } from "@ionic/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { BpAlert } from "../../components/shared/bp-alert";
import { RedefinirSenha } from "../../components/shared/redefinir-senha";
import { BpAlertTypeEnum } from "../../core/enums";
import { useModal } from "../../lib/modal";
import { delay } from "../../lib/native";
import { overlayService } from "../../lib/overlay";

export const Route = createFileRoute("/auth/recuperar-senha")({
  component: RecuperarSenhaPage,
});

function RecuperarSenhaPage() {
  const navigate = useNavigate();
  const { present } = useModal();
  const [token, setToken] = useState("");
  const [etapaSenha, setEtapaSenha] = useState(false);
  const [senhaOk, setSenhaOk] = useState(false);

  const confirmarToken = async () => {
    if (token.length !== 6) {
      await overlayService.toast({ message: "O código deve conter 6 caracteres.", color: "danger" });
      return;
    }
    setEtapaSenha(true);
  };

  const resetar = async () => {
    const loading = await overlayService.loading();
    await delay(600);
    await loading.dismiss();
    await present((fechar) => (
      <BpAlert
        dismiss={fechar}
        alertType={BpAlertTypeEnum.sucesso}
        mensagem="Sua senha foi redefinida com sucesso. Faça o login para continuar."
        labelBotao="Ir para o login"
      />
    ));
    navigate({ to: "/auth" });
  };

  return (
    <IonPage>
      <IonContent className="bg-auth">
        <IonRow>
          <IonImg src="/assets/images/shared/bp-logo.svg" alt="Buspay" className="bg-logo-recupera-senha" style={{ margin: "20px auto", width: "30%" }} />
        </IonRow>
        {!etapaSenha ? (
          <div className="bp-container" style={{ maxWidth: 400, margin: "auto" }}>
            <IonCard>
              <IonCardContent style={{ padding: "5%" }}>
                <IonText color="primary">
                  <h1>Informe o código enviado via SMS ou Email</h1>
                  <p>
                    Enviamos um código de validação via SMS ou Email, preencha o campo abaixo com o código enviado:
                  </p>
                </IonText>
                <label className="bp-label">Código de Validação:</label>
                <input
                  className="form-control bp-input"
                  maxLength={6}
                  placeholder="xxxxxx"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
                <IonButton className="bp-btn-primary" disabled={token.length !== 6} onClick={confirmarToken}>
                  Confirmar
                </IonButton>
                <IonText color="medium">
                  <p>
                    Não recebeu o token?{" "}
                    <a
                      onClick={() =>
                        overlayService.toast({ message: "Token reenviado (simulação).", color: "success" })
                      }
                      style={{ textDecoration: "underline" }}
                    >
                      Reenviar token
                    </a>
                  </p>
                </IonText>
              </IonCardContent>
            </IonCard>
          </div>
        ) : (
          <div className="bp-container" style={{ maxWidth: 400, margin: "auto" }}>
            <IonCard>
              <IonCardContent style={{ padding: 20 }}>
                <IonText color="primary">
                  <p>Preencha os campos abaixo para cadastrar uma nova senha:</p>
                </IonText>
                <RedefinirSenha onChange={(_, ok) => setSenhaOk(ok)} />
                <IonButton className="bp-btn-primary" disabled={!senhaOk} onClick={resetar}>
                  Enviar
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}
