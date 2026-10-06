import { IonButton, IonContent, IonHeader, IonIcon, IonToolbar } from "@ionic/react";
import { copyOutline, informationCircleOutline, shareOutline } from "ionicons/icons";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "@tanstack/react-router";

import { formatarMoeda } from "../../lib/mask-tools";
import type { DismissFn } from "../../lib/modal";
import { compartilhar, copiarTexto } from "../../lib/native";
import { overlayService } from "../../lib/overlay";
import { faqRecargaMock, pixRecargaMock } from "../../mocks/data";
import "./selecao-pagamento.scss";

export function PagamentoPix({
  dismiss,
  tipoRecarga,
  valor,
}: {
  dismiss: DismissFn;
  tipoRecarga: "C" | "E";
  valor: number;
}) {
  const navigate = useNavigate();
  const title = tipoRecarga === "C" ? "Comum" : "Estudante";

  return (
    <>
      <IonHeader>
        <IonToolbar className={`ion-padding item${tipoRecarga}`}>
          <h6 className="title-recarga">
            <span style={{ fontWeight: 300 }}>Recarga:</span> {title}
          </h6>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding txt-pix">
          <p className="txt-title">
            <b>Pagamento</b>
          </p>
          <p>Valor a pagar</p>
          <p className={`text-saldo Saldo${tipoRecarga}`}>{formatarMoeda(valor)}</p>
          <p className="mb-1 mt-4 txt-title">
            <b>Informações para o pagamento por PIX</b>
          </p>
          <p>
            Para completar sua compra utilize o QRCODE abaixo, ou copie o código e cole no app do banco.{" "}
            <a
              className={`link-clique textColor${tipoRecarga}`}
              onClick={() =>
                overlayService.alert({
                  header: "Dúvidas sobre recarga",
                  message: faqRecargaMock.map((f) => `${f.pergunta}\n${f.resposta}`).join("\n\n"),
                  buttons: [{ text: "Ok" }],
                })
              }
            >
              <b>Toque aqui</b>
            </a>{" "}
            e saiba mais.
          </p>
        </div>
        <div className="ion-text-center my-3">
          <QRCodeSVG value={pixRecargaMock.qrCode} size={220} level="M" />
        </div>
        <div className="ion-padding">
          <p style={{ marginTop: 16 }}>
            <b>Código PIX:</b>
          </p>
          <input type="text" value={pixRecargaMock.copiaECola} readOnly className="form-control bp-input" />
          <div className="mb-4 mt-4">
            <div className="row">
              <div className={`col-6 txt-mod textColor${tipoRecarga}`} onClick={() => copiarTexto(pixRecargaMock.copiaECola)}>
                <IonIcon icon={copyOutline} slot="start" size="small" />
                <span> Copiar código</span>
              </div>
              <div
                className={`col-6 txt-mod textColor${tipoRecarga}`}
                onClick={() => compartilhar({ title: "PIX Buspay", text: pixRecargaMock.copiaECola })}
              >
                <IonIcon icon={shareOutline} slot="start" size="small" />
                <span> Compartilhar código</span>
              </div>
            </div>
          </div>
        </div>
        <div className="background-info mt-3" style={{ background: "#f5f5f5" }}>
          <div className="ion-padding">
            <div className="mb-3">
              <IonIcon icon={informationCircleOutline} size="small" style={{ position: "relative", top: 3, paddingRight: 7 }} />
              <span>
                <b>Informação sobre o QR CODE / código PIX</b>
              </span>
            </div>
            <p>Você pode realizar o pagamento de {formatarMoeda(valor)} com este QR CODE ou código PIX a qualquer momento.</p>
          </div>
        </div>
        <div className="container mt-5 mb-5">
          <IonButton
            expand="block"
            color="primary"
            className="btn-avc"
            onClick={() => {
              dismiss("ok");
              navigate({ to: "/buspay/home" });
            }}
          >
            Finalizar e fechar
          </IonButton>
        </div>
      </IonContent>
    </>
  );
}
