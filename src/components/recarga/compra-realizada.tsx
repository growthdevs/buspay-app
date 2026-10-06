import { IonButton, IonContent, IonHeader, IonImg, IonToolbar } from "@ionic/react";
import { useNavigate } from "@tanstack/react-router";

import { formatarMoeda } from "../../lib/mask-tools";
import type { DismissFn } from "../../lib/modal";

export function CompraRealizada({
  dismiss,
  sucesso,
  valor,
  tipoCarteira,
}: {
  dismiss: DismissFn;
  sucesso: boolean;
  valor: number;
  tipoCarteira: string;
}) {
  const navigate = useNavigate();
  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className="ion-padding p-0">
          <div className="safe-area-top" />
          <IonImg src="/assets/images/shared/LOGO_AZUL.svg" alt="Buspay" className="bg-logo-azul" />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding text-center">
        {sucesso ? (
          <>
            <div className="d-flex justify-content-center pb-4">
              <IonImg className="img-sucesso-compra" src="/assets/icon/success.png" alt="sucesso na recarga" />
            </div>
            <h4 className="pb-3">Recarga realizada com sucesso</h4>
            <p>
              A recarga no valor de <b>{formatarMoeda(valor)}</b> para a <b>{tipoCarteira}</b> já está disponível.
            </p>
            <p>
              Caso deseje visualizar este crédito, acesse o <b>extrato de sua conta.</b>
            </p>
            <IonButton
              expand="block"
              color="primary"
              className="btn-avc"
              onClick={() => {
                dismiss();
                navigate({ to: "/buspay/extrato" });
              }}
            >
              Ver extrato
            </IonButton>
            <IonButton
              expand="block"
              className="btn-cancel"
              fill="clear"
              onClick={() => {
                dismiss();
                navigate({ to: "/buspay/home" });
              }}
            >
              Voltar para a página inicial
            </IonButton>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-center pb-4">
              <IonImg src="/assets/icon/falha-recarga-icon.png" alt="falha na recarga" />
            </div>
            <h4 className="pb-3">Compra não autorizada</h4>
            <p>verifique os dados do cartão ou altere a forma de pagamento para realizar uma recarga.</p>
            <IonButton expand="block" color="primary" onClick={() => dismiss("dadoCartao")}>
              Rever dados do cartão
            </IonButton>
          </>
        )}
      </IonContent>
    </>
  );
}
