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
  CartaoCredito,
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
import { TipoCartaoEnum } from "../core/enums";

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

  /** Cartões de crédito salvos (mock). */
  cartoes: CartaoCredito[];
  salvarCartao: (cartao: Omit<CartaoCredito, "id"> & { id?: number }) => CartaoCredito;
  excluirCartao: (id: number) => void;
  definirFavorito: (id: number) => void;

  /** Forma de pagamento ativa exibida na home (`bp-forma-pgto-passagem`). */
  mostrarToolbarECarteiras: boolean;
  setMostrarToolbarECarteiras: (valor: boolean) => void;
};

const AUTH_KEY = "buspay.autenticado";

// Mantém o mesmo contexto entre recarregamentos de módulo (HMR); sem isso o
// provider antigo e os consumidores novos usam contextos diferentes.
const globalCtx = globalThis as { __buspayAppStateCtx?: React.Context<AppState | null> };
const AppStateContext = (globalCtx.__buspayAppStateCtx ??= createContext<AppState | null>(null));

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

  const [cartoes, setCartoes] = useState<CartaoCredito[]>([
    { id: 1, bandeira: TipoCartaoEnum.Visa, ultimos4: "4781", nomeImpresso: "ERICK OLIVEIRA", validade: "01/29", apelido: "Cartão pessoal", favorito: true },
  ]);

  const salvarCartao = useCallback<AppState["salvarCartao"]>((dados) => {
    const salvo: CartaoCredito = { ...dados, id: dados.id ?? Date.now() };
    setCartoes((atual) => {
      // O primeiro cartão cadastrado vira favorito automaticamente.
      if (atual.length === 0 || (atual.length === 1 && atual[0]!.id === salvo.id)) salvo.favorito = true;
      const lista = atual.some((c) => c.id === salvo.id)
        ? atual.map((c) => (c.id === salvo.id ? salvo : c))
        : [...atual, salvo];
      return salvo.favorito ? lista.map((c) => ({ ...c, favorito: c.id === salvo.id })) : lista;
    });
    return salvo;
  }, []);

  const excluirCartao = useCallback((id: number) => {
    setCartoes((atual) => {
      const resto = atual.filter((c) => c.id !== id);
      if (resto.length && !resto.some((c) => c.favorito)) resto[0] = { ...resto[0]!, favorito: true };
      return resto;
    });
  }, []);

  const definirFavorito = useCallback((id: number) => {
    setCartoes((atual) => atual.map((c) => ({ ...c, favorito: c.id === id })));
  }, []);

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
      cartoes,
      salvarCartao,
      excluirCartao,
      definirFavorito,
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
      cartoes,
      salvarCartao,
      excluirCartao,
      definirFavorito,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState precisa estar dentro de <AppStateProvider>");
  return ctx;
}
