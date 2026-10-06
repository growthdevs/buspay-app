import { IonItem, IonList } from "@ionic/react";

import type { CarteiraDependente } from "../../core/models";
import { titleCase } from "../../lib/date-tools";
import type { DismissFn } from "../../lib/modal";

export function BpModalSelecaoDependentes({
  dismiss,
  dependentes,
  offline,
}: {
  dismiss: DismissFn;
  dependentes: CarteiraDependente[];
  offline: boolean;
}) {
  return (
    <>
      <div className="d-flex flex-row justify-content-end mx-3 my-2">
        <span className="fw-bold fs-lg text-primary" role="button" onClick={() => dismiss()}>
          X
        </span>
      </div>
      <p className="mb-2 mx-4 fs-sm fw-bold">
        {offline
          ? "Selecione a conta abaixo para gerar o pagamento offline"
          : "Selecione o dependente para visualizar o pagamento de passagem"}
      </p>
      <IonList className="mb-3">
        {offline && (
          <IonItem lines="full" onClick={() => dismiss({ acao: "minha-conta" })}>
            <p className="mb-0 ms-2 fw-bold fs-sm">Minha Conta</p>
          </IonItem>
        )}
        {dependentes.map((dependente, i) => (
          <IonItem
            key={dependente.contaId}
            lines="full"
            onClick={() => dismiss({ acao: "dependente", dependenteIndex: i })}
          >
            <p className="mb-0 ms-2 fw-bold fs-sm">{titleCase(dependente.nome)}</p>
          </IonItem>
        ))}
      </IonList>
    </>
  );
}
