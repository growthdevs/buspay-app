import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { NotificarBloqueios } from "../../components/home/notificar-bloqueios";
import { NotificarExpiracao } from "../../components/home/notificar-expiracao";
import { BpChamadaByx } from "../../components/shared/bp-chamada-byx";
import { BpContatos } from "../../components/shared/bp-contatos";
import { BpFormaPgtoPassagem } from "../../components/shared/bp-forma-pgto-passagem";
import { BpModalSelecaoDependentes } from "../../components/shared/bp-modal-selecao-dependentes";
import { BpTabs } from "../../components/shared/bp-tabs";
import { BpToolbar } from "../../components/shared/bp-toolbar";
import { Carteiras } from "../../components/shared/carteiras";
import { qrCodePagamentoMock } from "../../mocks/data";
import { useModal } from "../../lib/modal";
import { abrirNavegador, delay } from "../../lib/native";
import { overlayService } from "../../lib/overlay";
import { useAppState } from "../../state/app-state";
import "./home.scss";

export const Route = createFileRoute("/buspay/home")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { present } = useModal();
  const {
    carteirasUsuario,
    conectadoInternet,
    dadosUsuario,
    dependentes,
    mostrarToolbarECarteiras,
  } = useAppState();
  const [beneficioExpirado, setBeneficioExpirado] = useState(
    dadosUsuario.possuiBeneficioExpiradoSemCiencia === true,
  );

  const existemBloqueios = (dadosUsuario.contaBloqueios ?? []).some((b) => b.bloqueado);

  const abrirQr = async () => {
    if (!conectadoInternet) {
      if (dadosUsuario.possuiDependente) {
        const ret = await present(
          (fechar) => <BpModalSelecaoDependentes dismiss={fechar} dependentes={dependentes} offline />,
          { cssClass: "ion-modal-dependentes", backdropDismiss: false },
        );
        if (!ret.data) return qrCodePagamentoMock.payload;
      }
    }
    const loading = await overlayService.loading();
    await delay(400);
    await loading.dismiss();
    return qrCodePagamentoMock.payload;
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <BpToolbar />
      </IonHeader>
      <IonContent fullscreen>
        {beneficioExpirado && (
          <div className="fs-sm alert-beneficio-expirado bg-aviso-beneficio text-dark p-3 mx-3 rounded d-flex align-items-center my-3">
            <span className="material-symbols-outlined me-2 lh-1">info</span>
            <div>
              <strong>Atenção:</strong> Você tem benefícios <br /> expirados ou bloqueados.
              <span
                className="text-decoration-underline ms-1"
                onClick={() =>
                  present((fechar) => (
                    <NotificarExpiracao
                      dismiss={(data) => {
                        if ((data as { cienciaRegistrada?: boolean })?.cienciaRegistrada) setBeneficioExpirado(false);
                        fechar(data);
                      }}
                    />
                  ), { backdropDismiss: false, cssClass: "modal-fullscreen" })
                }
              >
                Saiba mais
              </span>
            </div>
          </div>
        )}

        <IonRefresher
          slot="fixed"
          onIonRefresh={async (e) => {
            if (!conectadoInternet) {
              await overlayService.toast({
                message: "Você está offline. Conecte-se à internet para atualizar.",
                color: "warning",
                duration: 3000,
              });
              e.detail.complete();
              return;
            }
            await delay(400);
            await overlayService.toast({ message: "Dados atualizados com sucesso!", color: "success", duration: 2000 });
            e.detail.complete();
          }}
        >
          <IonRefresherContent />
        </IonRefresher>

        <BpChamadaByx pagina="home" />

        {carteirasUsuario.length > 0 ? (
          conectadoInternet ? (
            <>
              <div className={mostrarToolbarECarteiras ? "" : "d-none"}>
                <Carteiras carteiras={carteirasUsuario} />
              </div>
              <div className="px-3 py-4 bg-gray-100">
                <BpFormaPgtoPassagem onSolicitarQrCode={abrirQr} />
                {existemBloqueios && (
                  <p className="fs-xs mt-2 p-3 mb-0 bg-white rounded">
                    <b className="text-danger">Atenção!</b> Você possui bloqueios na sua conta,{" "}
                    <b
                      onClick={() =>
                        present((fechar) => (
                          <NotificarBloqueios dismiss={fechar} bloqueios={dadosUsuario.contaBloqueios} />
                        ))
                      }
                      className="text-decoration-underline"
                    >
                      toque aqui e saiba mais
                    </b>
                    .
                  </p>
                )}
              </div>
              <div onClick={() => abrirNavegador("https://www.youtube.com/@Buspaytec")} className="d-flex justify-content-center my-3">
                <img src="/assets/images/home/banner-validador.jpg" alt="Validador Buspay" />
              </div>
            </>
          ) : (
            <Offline onGerar={() => abrirQr()} possuiDependente={dadosUsuario.possuiDependente} />
          )
        ) : conectadoInternet ? (
          <>
            <div className="d-flex flex-row justify-content-center mx-5 mt-4 mb-3">
              <img src="/assets/images/home/bem-vindo.svg" alt="Rapaz feliz dando boas-vindas" />
            </div>
            <div className="mx-5 mt-2">
              <p className="fw-bold mb-1 text-start text-primary fs-lg">Bem vindo(a) à BUSPAY!</p>
              <p className="text-start mb-4 fs-sm">
                Confira 3 formas de ativar o app. Se precisar de ajuda,{" "}
                <span className="fw-bold text-secondary" onClick={() => present((f) => <BpContatos dismiss={f} />)}>
                  fale com a gente.
                </span>
              </p>
              <p className="fw-bold fs-sm mb-1">1. Realizando uma recarga</p>
              <p className="fs-sm mb-2">Após a recarga, o saldo fica disponível para uso na região escolhida.</p>
              <IonButton onClick={() => navigate({ to: "/buspay/recarga" })} color="primary" className="d-flex flex-row w-75 mb-4 mt-3 btn-reativar-pgto">
                Faça sua recarga aqui
              </IonButton>
              <p className="fw-bold fs-sm mb-1">2. Solicitando benefício de gratuidade</p>
              <p className="fs-sm">
                Depois de solicitar e ter seu benefício aprovado<sup className="fs-xs text-gray-700">1</sup>, você
                poderá usar o app.{" "}
                <span className="fw-bold text-secondary" onClick={() => navigate({ to: "/buspay/beneficio" })}>
                  Solicite seu benefício aqui.
                </span>
              </p>
              <p className="fs-xs mb-4 mt-3 text-gray-700">
                <sup>1</sup>Prazo para aprovação e regras podem mudar de acordo com a região.
              </p>
              <p className="fw-bold fs-sm mb-1">3. Pelo Vale Transporte</p>
              <p className="fs-sm">
                Ative seu vale-transporte junto ao empregador. Saiba mais em{" "}
                <span className="fw-bold text-secondary" onClick={() => navigate({ to: "/buspay/ajuda" })}>
                  Dúvidas frequentes.
                </span>
              </p>
            </div>
          </>
        ) : (
          <Offline onGerar={() => abrirQr()} possuiDependente={dadosUsuario.possuiDependente} />
        )}
      </IonContent>
      <IonFooter>
        <BpTabs />
      </IonFooter>
    </IonPage>
  );
}

function Offline({ onGerar, possuiDependente }: { onGerar: () => void; possuiDependente: boolean }) {
  return (
    <>
      <div className="d-flex flex-row justify-content-center mx-5 mt-4">
        <span className="material-symbols-outlined text-danger fs-3xl">android_wifi_4_bar_off</span>
      </div>
      <div className="mx-5 mt-2">
        <p className="fw-bold mb-1 text-center">Ops! Sem internet.</p>
        <p className="text-center mb-2 fs-sm">Por isso, não conseguimos atualizar seus dados agora.</p>
        <p className="text-center mb-1 fs-sm">
          Mas você pode gerar um <b>&quot;pagamento offline&quot;</b> para usar no ônibus.
        </p>
      </div>
      <IonButton onClick={onGerar} color="primary" className="d-flex flex-row w-75 mx-auto my-3 btn-reativar-pgto">
        Gerar pagamento offline
      </IonButton>
      <p className="mb-0 mx-5 text-center fs-xs">Seus dados serão atualizados assim que houver conexão.</p>
      {possuiDependente ? null : null}
    </>
  );
}
