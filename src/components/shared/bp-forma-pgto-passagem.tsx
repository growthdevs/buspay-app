import { IonButton, IonContent, IonIcon, IonModal, IonProgressBar } from "@ionic/react";
import { timerOutline } from "ionicons/icons";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

import { qrCodePagamentoMock } from "../../mocks/data";
import "./bp-forma-pgto-passagem.scss";

const TEMPO_TOTAL = 20;

export function BpFormaPgtoPassagem({
  onSolicitarQrCode,
}: {
  onSolicitarQrCode?: () => string | Promise<string>;
}) {
  const [aberto, setAberto] = useState(false);
  const [tempo, setTempo] = useState(TEMPO_TOTAL);
  const [qr, setQr] = useState(qrCodePagamentoMock.payload);
  const timer = useRef<number | null>(null);

  const limpar = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
  };

  const iniciar = async () => {
    const payload = (await onSolicitarQrCode?.()) ?? qrCodePagamentoMock.payload;
    setQr(payload);
    setTempo(TEMPO_TOTAL);
    setAberto(true);
    limpar();
    timer.current = window.setInterval(() => {
      setTempo((t) => {
        if (t <= 1) {
          limpar();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const desativar = () => {
    limpar();
    setAberto(false);
    setTempo(TEMPO_TOTAL);
  };

  useEffect(() => () => limpar(), []);

  return (
    <>
      <div className="d-flex flex-row bg-white rounded-4 shadow-sm px-3 py-4" role="button">
        <img src="/assets/svg/formas-pgto-icones/QRCODE.svg" className="me-3" alt="QR Code" width={72} />
        <div>
          <p className="fw-bold mb-0">Pagar com QR Code</p>
          <p className="fs-sm my-2">
            Ao entrar no ônibus, <br />
            <b>abra o QR Code</b> e aproxime do leitor.
          </p>
          <button className="bg-primary px-4 py-2 fw-bold fs-sm text-center text-white rounded" onClick={iniciar}>
            Abrir QR Code
          </button>
        </div>
      </div>

      <IonModal isOpen={aberto} backdropDismiss={false} onDidDismiss={desativar}>
        <IonContent>
          <div className="safe-area-top" />
          <div className="container-fluid px-3 py-4 d-flex justify-content-center">
            <div className="bg-white w-100">
              <div className="d-flex justify-content-end">
                <button type="button" className="btn p-0 fw-bold fs-xl" onClick={desativar} aria-label="Fechar modal">
                  X
                </button>
              </div>
              <div className="d-flex justify-content-center mt-1">
                <img src="/assets/images/shared/LOGO_AZUL.svg" alt="Buspay" width={110} height={18} />
              </div>
              <p className="fw-bold text-center mb-1 mt-3 fs-lg">Pagamento por QR Code</p>
              <p className="text-center mb-3 fs-sm">Aproxime o QR Code do validador</p>

              {tempo > 0 ? (
                <>
                  <div className="row mx-3 align-items-center">
                    <div className="col-4 d-flex align-items-center p-0">
                      <IonIcon icon={timerOutline} />
                      <span className="fw-bold ms-1 qr-timer-text">{tempo} segs</span>
                    </div>
                    <IonProgressBar className="col-8 rounded" type="determinate" value={tempo / TEMPO_TOTAL} />
                  </div>
                  <div className="d-flex justify-content-center qr-code py-3" onClick={iniciar}>
                    <QRCodeSVG value={qr} size={280} level="H" />
                  </div>
                  <p className="mb-3 text-center fs-xs text-gray-600">Toque no QR Code para atualizar.</p>
                  <IonButton expand="block" className="mx-3" onClick={desativar}>
                    Fechar
                  </IonButton>
                </>
              ) : (
                <>
                  <div className="d-flex flex-row justify-content-center mx-5 mt-4">
                    <IonIcon icon={timerOutline} className="fs-3xl" color="danger" />
                  </div>
                  <div className="mx-5 mt-2">
                    <p className="fw-bold mb-1 text-center">Tempo esgotado.</p>
                    <p className="text-center mb-1 fs-sm">Deseja reativar o pagamento por QR Code?</p>
                  </div>
                  <IonButton onClick={iniciar} color="primary" className="d-flex flex-row w-50 mx-auto my-3 btn-reativar-pgto">
                    Reativar
                  </IonButton>
                  <p className="mb-0 mx-5 text-center fs-xs">
                    Após a reativação, você terá {TEMPO_TOTAL} segundos para concluir o pagamento da passagem.
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="safe-area-bottom" />
        </IonContent>
      </IonModal>
    </>
  );
}
