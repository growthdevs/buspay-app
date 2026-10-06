import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AtribuicaoBeneficio,
  Carteira,
  CarteiraDependente,
  Extrato,
  NotificacoesRetorno,
  Praca,
  SaldosPorBilhetadora,
  SolicitacaoAtivacaoVT,
  SolicitacaoBeneficio,
  Usuario,
} from "../core/models";
import {
  atribuicoesBeneficioMock,
  carteirasMock,
  dependentesMock,
  dependentesSaldosMock,
  extratoMock,
  notificacoesMock,
  pracasMock,
  saldosBilhetadorasMock,
  solicitacoesBeneficioMock,
  solicitacoesVtMock,
  usuarioMock,
} from "../mocks/data";

/**
 * Reúne o que no app Angular estava dividido entre `AcessoTools`, `UserTools`,
 * `DatabaseService` e `NotificacoesSignalRService`. Todo o conteúdo vem dos
 * mocks — não há chamada de rede em nenhum ponto.
 */
export type AppState = {
  /** `AcessoTools.dadosUsuario` / `UserTools.dadosUsuario` */
  dadosUsuario: Usuario;
  setDadosUsuario: (usuario: Usuario) => void;

  /** `AcessoTools.carteirasUsuario` */
  carteirasUsuario: Carteira[];
  setCarteirasUsuario: (carteiras: Carteira[]) => void;

  /** `AcessoTools.conectadoInternet` */
  conectadoInternet: boolean;
  setConectadoInternet: (valor: boolean) => void;

  /** `AcessoTools.autenticacaoBiometricaDisponivel` */
  autenticacaoBiometricaDisponivel: boolean;

  autenticado: boolean;
  entrar: () => void;
  sair: () => void;

  /** `DatabaseService.dataBaseModel` */
  dependentes: CarteiraDependente[];
  dependentesSaldos: typeof dependentesSaldosMock;
  saldosBilhetadoras: SaldosPorBilhetadora[];
  pracas: Praca[];
  saldosAtualizadosEm: Date;

  extrato: Extrato[];
  solicitacoesBeneficio: SolicitacaoBeneficio[];
  setSolicitacoesBeneficio: (solicitacoes: SolicitacaoBeneficio[]) => void;
  atribuicoesBeneficio: AtribuicaoBeneficio[];
  solicitacoesVt: SolicitacaoAtivacaoVT[];

  /** `NotificacoesSignalRService.notificacoesRecebidas` */
  notificacoesRecebidas: NotificacoesRetorno;
  marcarNotificacoesComoVisualizadas: () => void;

  /** Forma de pagamento ativa exibida na home (`bp-forma-pgto-passagem`). */
  mostrarToolbarECarteiras: boolean;
  setMostrarToolbarECarteiras: (valor: boolean) => void;
};

const AUTH_KEY = "buspay.autenticado";

const AppStateContext = createContext<AppState | null>(null);

function autenticadoPersistido(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "1";
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [dadosUsuario, setDadosUsuario] = useState<Usuario>(usuarioMock);
  const [carteirasUsuario, setCarteirasUsuario] = useState<Carteira[]>(carteirasMock);
  const [conectadoInternet, setConectadoInternet] = useState(true);
  const [autenticado, setAutenticado] = useState(autenticadoPersistido);
  const [solicitacoesBeneficio, setSolicitacoesBeneficio] = useState<SolicitacaoBeneficio[]>(
    solicitacoesBeneficioMock,
  );
  const [notificacoesRecebidas, setNotificacoesRecebidas] =
    useState<NotificacoesRetorno>(notificacoesMock);
  const [mostrarToolbarECarteiras, setMostrarToolbarECarteiras] = useState(true);

  const marcarNotificacoesComoVisualizadas = useCallback(() => {
    setNotificacoesRecebidas((atual) => ({ ...atual, quantidadeNaoVisualizadas: 0 }));
  }, []);

  const entrar = useCallback(() => {
    sessionStorage.setItem(AUTH_KEY, "1");
    setAutenticado(true);
  }, []);
  const sair = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setAutenticado(false);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      dadosUsuario,
      setDadosUsuario,
      carteirasUsuario,
      setCarteirasUsuario,
      conectadoInternet,
      setConectadoInternet,
      autenticacaoBiometricaDisponivel: true,
      autenticado,
      entrar,
      sair,
      dependentes: dependentesMock,
      dependentesSaldos: dependentesSaldosMock,
      saldosBilhetadoras: saldosBilhetadorasMock,
      pracas: pracasMock,
      saldosAtualizadosEm: new Date(),
      extrato: extratoMock,
      solicitacoesBeneficio,
      setSolicitacoesBeneficio,
      atribuicoesBeneficio: atribuicoesBeneficioMock,
      solicitacoesVt: solicitacoesVtMock,
      notificacoesRecebidas,
      marcarNotificacoesComoVisualizadas,
      mostrarToolbarECarteiras,
      setMostrarToolbarECarteiras,
    }),
    [
      dadosUsuario,
      carteirasUsuario,
      conectadoInternet,
      autenticado,
      entrar,
      sair,
      solicitacoesBeneficio,
      notificacoesRecebidas,
      marcarNotificacoesComoVisualizadas,
      mostrarToolbarECarteiras,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState precisa estar dentro de <AppStateProvider>");
  return ctx;
}
