import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { chevronDownOutline, eyeOffOutline, eyeOutline } from "ionicons/icons";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { BackButton } from "../../components/shared/back-button";
import { BpChamadaByx } from "../../components/shared/bp-chamada-byx";
import { BpTabs } from "../../components/shared/bp-tabs";
import { DetalheExtrato } from "../../components/extrato/detalhe-extrato";
import { FiltroExtrato } from "../../components/extrato/filtro-extrato";
import { EnumTipoCarteiraExtratoApp, TipoTransacaoEnum } from "../../core/enums";
import type { Extrato } from "../../core/models";
import { diaDaSemana, hojeOuOntem } from "../../lib/date-tools";
import { iconeItemExtrato, labelCarteira, labelTipoProcesso, labelTipoTransacao, temaCarteira } from "../../lib/labels";
import { formatarData, formatarMoeda } from "../../lib/mask-tools";
import { useModal } from "../../lib/modal";
import { useAppState } from "../../state/app-state";
import "./extrato.scss";

export const Route = createFileRoute("/buspay/extrato")({
  component: ExtratoPage,
});

function ExtratoPage() {
  const { present } = useModal();
  const { extrato, carteirasUsuario, pracas, dadosUsuario } = useAppState();
  const [carteira, setCarteira] = useState(EnumTipoCarteiraExtratoApp.Regular);
  const [mostrar, setMostrar] = useState(true);
  const [aba, setAba] = useState<"todos" | "entrada" | "saida">("todos");
  const [dias, setDias] = useState(90);
  const tema = temaCarteira(carteira);
  const praca = pracas.find((p) => p.bilhetadora.id === dadosUsuario.bilhetadoraId) ?? pracas[0];
  const saldo = carteirasUsuario.find((c) => c.enumTipoCarteiraExtratoApp === carteira)?.saldo ?? 0;

  const filtrado = useMemo(() => {
    const limite = new Date();
    limite.setDate(limite.getDate() - dias);
    return extrato.filter((e) => {
      if (carteira !== EnumTipoCarteiraExtratoApp.Todos && e.carteiraTipo !== carteira) return false;
      if (aba === "entrada" && e.tipoTransacao !== TipoTransacaoEnum.credito) return false;
      if (aba === "saida" && e.tipoTransacao !== TipoTransacaoEnum.debito) return false;
      return new Date(e.data) >= limite;
    });
  }, [extrato, carteira, aba, dias]);

  const agrupado = useMemo(() => {
    const map = new Map<string, Extrato[]>();
    for (const item of filtrado) {
      const chave = item.data.slice(0, 10);
      map.set(chave, [...(map.get(chave) ?? []), item]);
    }
    return [...map.entries()];
  }, [filtrado]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={`extrato-toolbar tema${tema} ion-padding`}>
          <div className="safe-area-top" />
          <div>
            <BackButton />
            <p>Extrato</p>
            <h3>{labelCarteira(carteira)}</h3>
          </div>
          <div className="d-flex flex-row align-items-center justify-content-between">
            <div
              className="d-flex flex-row align-items-center"
              onClick={() =>
                present((fechar) => (
                  <FiltroExtrato
                    dismiss={fechar}
                    dias={dias}
                    onAplicar={(d) => setDias(d)}
                  />
                ))
              }
            >
              <p className="p-0 m-0">
                {praca?.cidade.nome} - {praca?.cidade.estado?.sigla}
              </p>
              <IonIcon className="mx-1" icon={chevronDownOutline} />
            </div>
            <div
              className="d-flex flex-row align-items-center"
              onClick={() => {
                const proximo =
                  carteira === EnumTipoCarteiraExtratoApp.Regular
                    ? EnumTipoCarteiraExtratoApp.VT
                    : carteira === EnumTipoCarteiraExtratoApp.VT
                      ? EnumTipoCarteiraExtratoApp.Estudante
                      : EnumTipoCarteiraExtratoApp.Regular;
                setCarteira(proximo);
              }}
            >
              <p className="p-0 m-0">Outras carteiras</p>
              <IonIcon className="mx-1" icon={chevronDownOutline} />
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <BpChamadaByx pagina="extrato" />
        <div className="extrato-saldo ion-padding">
          <div className="row">
            <div className="col">
              <div className="extrato-saldo-titulo">
                <label className="extrato-saldo-titulo-label">Saldo disponível:</label>
                <IonIcon
                  className="extrato-saldo-titulo-icon"
                  icon={mostrar ? eyeOutline : eyeOffOutline}
                  onClick={() => setMostrar((v) => !v)}
                />
              </div>
              <p className={`extrato-saldo-valor textoTema${tema}`}>{mostrar ? formatarMoeda(saldo) : "R$ * * * *"}</p>
            </div>
            <div className="col extrato-saldo-filtro text-center align-self-center">
              <IonButton
                fill="outline"
                className="extrato-saldo-filtro-btn"
                onClick={() => present((fechar) => <FiltroExtrato dismiss={fechar} dias={dias} onAplicar={setDias} />)}
              >
                Filtrar
              </IonButton>
            </div>
          </div>
          <IonAccordionGroup>
            <IonAccordion value="verMais" toggleIcon="">
              <IonItem className="ion-no-padding" slot="header">
                <IonLabel className="extrato-saldo-lista-carteiras">Ver mais</IonLabel>
              </IonItem>
              <IonList slot="content">
                <p className="extrato-saldo-lista-carteiras">
                  {carteira === EnumTipoCarteiraExtratoApp.Todos
                    ? "*Este saldo inclui os valores disponíveis nas carteiras abaixo:"
                    : "Saldo da carteira selecionada para o município informado."}
                </p>
              </IonList>
            </IonAccordion>
          </IonAccordionGroup>
        </div>
        <IonSegment value={aba} onIonChange={(e) => setAba(e.detail.value as typeof aba)}>
          <IonSegmentButton value="todos" className={`textoTema${tema}`}>
            <IonLabel>Lançamentos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="entrada" className={`textoTema${tema}`}>
            <IonLabel>Entradas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="saida" className={`textoTema${tema}`}>
            <IonLabel>Saídas</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {filtrado.length === 0 && (
          <div className="ion-padding">
            <p className="nenhum-registro-title">Nada por aqui.</p>
            <p className="nenhum-registro-text">Você não possui lançamentos para o filtro atual.</p>
          </div>
        )}
        {agrupado.map(([dia, itens]) => (
          <IonList key={dia} lines="none">
            <IonListHeader className="extrato-data">
              <p>
                {hojeOuOntem(dia)} {formatarData(dia)} - {diaDaSemana(dia)}
              </p>
            </IonListHeader>
            {itens.map((lancamento) => (
              <IonItem
                key={lancamento.id}
                className="extrato-item"
                onClick={() => present((fechar) => <DetalheExtrato dismiss={fechar} lancamento={lancamento} />)}
              >
                <IonImg src={`/assets/icon/${iconeItemExtrato(lancamento.processoTipo)}.png`} slot="start" />
                <IonText>
                  <p className="extrato-item-tipo-transacoes">
                    <b>
                      {labelTipoTransacao(lancamento.tipoTransacao)} - {labelTipoProcesso(lancamento.processoTipo)}
                    </b>
                  </p>
                  <span>
                    Carteira:{" "}
                    <span className={`extrato-tipo-carteira item${temaCarteira(lancamento.carteiraTipo)}`}>
                      {labelCarteira(lancamento.carteiraTipo)}
                    </span>
                  </span>
                  <p className="extrato-mostrar-nome-cidade">
                    {praca?.cidade.nome} - {praca?.cidade.estado?.sigla}
                  </p>
                </IonText>
                <IonText slot="end">
                  <p className="extrato-item-valor">
                    {lancamento.tipoTransacao === TipoTransacaoEnum.debito ? "-" : ""}
                    {formatarMoeda(lancamento.valor)}
                  </p>
                </IonText>
              </IonItem>
            ))}
          </IonList>
        ))}
      </IonContent>
      <IonFooter>
        <BpTabs />
      </IonFooter>
    </IonPage>
  );
}
