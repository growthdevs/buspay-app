import { IonSelect, IonSelectOption } from "@ionic/react";
import { useEffect, useState } from "react";

import type { Praca } from "../../core/models";
import { pracasMock } from "../../mocks/data";
import { useAppState } from "../../state/app-state";

export function BpPraca({
  onPracaSelected,
  bilhetadoraId,
}: {
  onPracaSelected?: (praca: Praca) => void;
  bilhetadoraId?: number;
}) {
  const { pracas, dadosUsuario } = useAppState();
  const lista = pracas.length ? pracas : pracasMock;
  const inicial =
    lista.find((p) => p.bilhetadora.id === (bilhetadoraId ?? dadosUsuario.bilhetadoraId)) ?? lista[0];
  const [selecionada, setSelecionada] = useState<number>(inicial?.id ?? 1);

  useEffect(() => {
    const atual = lista.find((p) => p.id === selecionada);
    if (atual) onPracaSelected?.(atual);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecionada]);

  return (
    <>
      <div className="d-flex flex-row justify-content-start mb-2">
        <label style={{ fontSize: 14 }}>
          <b>Município:</b>
        </label>
      </div>
      <IonSelect
        className="select-cidade"
        cancelText="Cancelar"
        interface="action-sheet"
        labelPlacement="stacked"
        value={selecionada}
        onIonChange={(e) => setSelecionada(Number(e.detail.value))}
      >
        {lista.map((praca) => (
          <IonSelectOption key={praca.id} value={praca.id}>
            {praca.cidade.nome} - {praca.cidade.estado?.sigla}
          </IonSelectOption>
        ))}
      </IonSelect>
    </>
  );
}
