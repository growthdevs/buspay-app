import { IonModal } from "@ionic/react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Equivalente ao `ModalController` do Ionic/Angular. Mantém uma pilha de modais
 * para que qualquer componente possa abrir outro componente como modal e
 * aguardar o resultado via `onDidDismiss`, exatamente como no app original.
 */
export type DismissFn = (data?: unknown, role?: string) => void;

export type ModalOptions = {
  cssClass?: string;
  backdropDismiss?: boolean;
  initialBreakpoint?: number;
  breakpoints?: number[];
};

export type ModalResult = { data?: unknown; role?: string };

type ModalEntry = {
  id: number;
  render: (dismiss: DismissFn) => ReactNode;
  options: ModalOptions;
  resolve: (result: ModalResult) => void;
  aberto: boolean;
};

type ModalApi = {
  present: (
    render: (dismiss: DismissFn) => ReactNode,
    options?: ModalOptions,
  ) => Promise<ModalResult>;
  dismissTop: (data?: unknown, role?: string) => void;
};

const ModalContext = createContext<ModalApi | null>(null);

let proximoId = 1;

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modais, setModais] = useState<ModalEntry[]>([]);
  const resultados = useRef(new Map<number, ModalResult>());

  const fechar = useCallback((id: number, data?: unknown, role?: string) => {
    resultados.current.set(id, { data, ...(role !== undefined ? { role } : {}) });
    setModais((atual) => atual.map((m) => (m.id === id ? { ...m, aberto: false } : m)));
  }, []);

  const aoTerminarAnimacao = useCallback((id: number) => {
    setModais((atual) => {
      const entrada = atual.find((m) => m.id === id);
      entrada?.resolve(resultados.current.get(id) ?? {});
      resultados.current.delete(id);
      return atual.filter((m) => m.id !== id);
    });
  }, []);

  const present = useCallback<ModalApi["present"]>(
    (render, options = {}) =>
      new Promise<ModalResult>((resolve) => {
        const id = proximoId++;
        setModais((atual) => [...atual, { id, render, options, resolve, aberto: true }]);
      }),
    [],
  );

  const dismissTop = useCallback(
    (data?: unknown, role?: string) => {
      setModais((atual) => {
        const topo = atual[atual.length - 1];
        if (topo) fechar(topo.id, data, role);
        return atual;
      });
    },
    [fechar],
  );

  const api = useMemo<ModalApi>(() => ({ present, dismissTop }), [present, dismissTop]);

  return (
    <ModalContext.Provider value={api}>
      {children}
      {modais.map((modal) => (
        <IonModal
          key={modal.id}
          isOpen={modal.aberto}
          backdropDismiss={modal.options.backdropDismiss ?? true}
          {...(modal.options.cssClass ? { className: modal.options.cssClass } : {})}
          {...(modal.options.initialBreakpoint !== undefined
            ? { initialBreakpoint: modal.options.initialBreakpoint, breakpoints: modal.options.breakpoints }
            : {})}
          onDidDismiss={() => aoTerminarAnimacao(modal.id)}
          onIonModalWillDismiss={() => fechar(modal.id)}
        >
          {modal.render((data, role) => fechar(modal.id, data, role))}
        </IonModal>
      ))}
    </ModalContext.Provider>
  );
}

export function useModal(): ModalApi {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal precisa estar dentro de <ModalProvider>");
  return ctx;
}
