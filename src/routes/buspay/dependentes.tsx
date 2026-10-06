import { IonContent, IonFooter, IonPage } from "@ionic/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { BpFormaPgtoPassagem } from "../../components/shared/bp-forma-pgto-passagem";
import { Carteiras } from "../../components/shared/carteiras";
import { titleCase } from "../../lib/date-tools";
import { qrCodePagamentoMock } from "../../mocks/data";
import { useAppState } from "../../state/app-state";

export const Route = createFileRoute("/buspay/dependentes")({
  component: DependentesPage,
});

function DependentesPage() {
  const navigate = useNavigate();
  const { dependentes } = useAppState();
  const [indice, setIndice] = useState(0);
  const atual = dependentes[indice];

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="safe-area-top" />
        <div className="d-flex flex-row justify-content-end px-2 pt-2 w-100">
          <span className="fw-bold fs-xl py-2 text-primary" role="button" onClick={() => navigate({ to: "/buspay/home" })}>
            X
          </span>
        </div>
        {atual && (
          <>
            <div className="d-flex flex-row justify-content-start mx-3">
              <p className="m-0 fs-xl fw-bold">{titleCase(atual.nome)}</p>
            </div>
            <Carteiras carteiras={atual.carteiras} carteirasDependentes />
            <div className="bg-gray-100 h-100 w-100 pt-2">
              <div className="my-3 mx-3">
                <BpFormaPgtoPassagem onSolicitarQrCode={async () => qrCodePagamentoMock.payload} />
              </div>
            </div>
          </>
        )}
      </IonContent>
      <IonFooter className="bg-white">
        <div className="d-flex justify-content-center align-items-center gap-2 my-2">
          {dependentes.map((d, i) => (
            <div
              key={d.contaId}
              onClick={() => setIndice(i)}
              style={{
                width: 8,
                height: 8,
                borderRadius: 8,
                background: i === indice ? "var(--ion-color-primary)" : "#ddd",
              }}
            />
          ))}
        </div>
        {dependentes.length > 1 && (
          <p className="text-center px-4">
            <b>Arraste para o lado para ver os demais dependentes</b>
          </p>
        )}
        <div className="d-flex justify-content-center gap-3 mb-2">
          {dependentes.map((d, i) => (
            <button key={d.contaId} className="btn btn-link" onClick={() => setIndice(i)}>
              {titleCase(d.nome.split(" ")[0])}
            </button>
          ))}
        </div>
        <div className="safe-area-bottom" />
      </IonFooter>
    </IonPage>
  );
}
