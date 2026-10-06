import { IonButton, IonIcon } from "@ionic/react";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";

import { EnumTipoCarteiraExtratoApp } from "../../core/enums";
import type { Carteira, Praca } from "../../core/models";
import { formatarMoeda } from "../../lib/mask-tools";
import { labelCarteira } from "../../lib/labels";
import { useModal } from "../../lib/modal";
import { useAppState } from "../../state/app-state";
import { BpModalSelecaoDependentes } from "./bp-modal-selecao-dependentes";
import "./carteiras.scss";

export function Carteiras({
  carteiras,
  carteirasDependentes = false,
  onPracaMudou,
}: {
  carteiras: Carteira[];
  carteirasDependentes?: boolean;
  onPracaMudou?: (praca: Praca) => void;
}) {
  const navigate = useNavigate();
  const { present } = useModal();
  const { pracas, dadosUsuario, dependentes, conectadoInternet } = useAppState();
  const [indice, setIndice] = useState(0);
  const [mostrar, setMostrar] = useState(true);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const pracaSelecionada = useMemo(
    () => pracas.find((p) => p.bilhetadora.id === dadosUsuario.bilhetadoraId) ?? pracas[0],
    [pracas, dadosUsuario.bilhetadoraId],
  );

  const carteirasPraca = useMemo(
    () => carteiras.filter((c) => c.bilhetadoraId === pracaSelecionada?.bilhetadora.id),
    [carteiras, pracaSelecionada],
  );

  const lista = carteirasPraca.length ? carteirasPraca : carteiras;

  return (
    <>
      {pracaSelecionada && (
        <div className="mx-3 my-3 d-flex flex-row justify-content-between">
          <p className="m-0 fs-xs">
            Você está usando a BUSPAY em <br />
            <b className="fs-sm">
              {pracaSelecionada.cidade.nome} - {pracaSelecionada.cidade.estado?.sigla}
            </b>
          </p>
        </div>
      )}

      <Swiper
        className="mx-3 swiper-carteiras"
        spaceBetween={12}
        onSwiper={setSwiper}
        onSlideChange={(s) => setIndice(s.activeIndex)}
      >
        {lista.map((c) => {
          const slideClass =
            c.ativo && !c.mostrarDetalheAtivacaoVT
              ? `carteira-slide-${c.enumTipoCarteiraExtratoApp}`
              : "carteira-slide-4";
          return (
            <SwiperSlide key={c.id} className={slideClass}>
              <div className="d-flex flex-row justify-content-between align-items-center mx-3 mt-3 mb-2">
                <p className="carteira-p m-0">{labelCarteira(c.enumTipoCarteiraExtratoApp)}</p>
                {!c.ocultarSaldoVT && (
                  <div onClick={() => setMostrar((v) => !v)}>
                    <IonIcon className="fs-5" icon={mostrar ? eyeOutline : eyeOffOutline} />
                  </div>
                )}
              </div>
              <div className="d-flex flex-row justify-content-between align-items-center mx-3">
                {!c.ocultarSaldoVT && (
                  <p className="carteira-p saldo m-0">{mostrar ? formatarMoeda(c.valor) : "R$ * * * *"}</p>
                )}
                {!carteirasDependentes &&
                  c.ativo &&
                  c.enumTipoCarteiraExtratoApp !== EnumTipoCarteiraExtratoApp.VT && (
                    <IonButton onClick={() => navigate({ to: "/buspay/recarga" })} className="btn-recarga">
                      Fazer Recarga
                    </IonButton>
                  )}
              </div>
              <p className="mx-3 mb-3 mt-2 fs-xs">{c.descricaoExtrato}</p>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div
        className={`d-flex p-2 justify-content-${lista.length > 1 && (dadosUsuario.possuiDependente || dadosUsuario.possuiPcdComoAcompanhante) ? "between" : lista.length > 1 ? "start" : "end"}`}
      >
        {lista.length > 1 && (
          <div className="d-flex flex-row align-items-center justify-content-start gap-2 mx-2">
            {lista.map((c, i) => (
              <div
                key={c.id}
                className={`${c.ativo ? `carteira-slide-${c.enumTipoCarteiraExtratoApp}` : "carteira-slide-4"} btn-quadrado mt-1 position-relative ${indice === i ? "btn-quadrado-ativo" : "btn-quadrado-inativo"}`}
                onClick={() => {
                  setIndice(i);
                  swiper?.slideTo(i);
                }}
              >
                {c.enumTipoCarteiraExtratoApp === 1 ? "C" : c.enumTipoCarteiraExtratoApp === 2 ? "VT" : "E"}
              </div>
            ))}
          </div>
        )}
        {(dadosUsuario.possuiDependente || dadosUsuario.possuiPcdComoAcompanhante) &&
          !carteirasDependentes &&
          conectadoInternet && (
            <div className="mx-2">
              <IonButton
                onClick={() =>
                  present(
                    (fechar) => (
                      <BpModalSelecaoDependentes
                        dismiss={fechar}
                        dependentes={dependentes}
                        offline={false}
                      />
                    ),
                    { cssClass: "ion-modal-dependentes", backdropDismiss: false },
                  ).then((ret) => {
                    const data = ret.data as { acao?: string } | undefined;
                    if (data?.acao === "dependente" || data?.acao === "minha-conta") {
                      if (pracaSelecionada) onPracaMudou?.(pracaSelecionada);
                      if (data.acao === "dependente") navigate({ to: "/buspay/dependentes" });
                    }
                  })
                }
                className="btn-dependentes text-decoration-underline"
                color="primary"
                fill="clear"
              >
                Meus Dependentes
              </IonButton>
            </div>
          )}
      </div>
    </>
  );
}
