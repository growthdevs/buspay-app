import { IonIcon, IonImg } from "@ionic/react";
import { ellipsisHorizontalSharp, qrCodeOutline } from "ionicons/icons";
import { useNavigate } from "@tanstack/react-router";

import { useModal } from "../../lib/modal";
import { overlayService } from "../../lib/overlay";
import { useAppState } from "../../state/app-state";
import { BpMenu } from "./bp-menu";
import "./bp-tabs.scss";

export function BpTabs() {
  const navigate = useNavigate();
  const { present } = useModal();
  const { carteirasUsuario } = useAppState();

  const avisoCarteira = () => {
    overlayService.toast({
      message: "Você ainda não possui uma carteira.",
      duration: 4000,
      position: "top",
      color: "danger",
    });
  };

  const showMenu = () => {
    present((dismiss) => <BpMenu dismiss={dismiss} />, { backdropDismiss: false });
  };

  return (
    <nav className="bp-tab-bar" role="tablist" aria-label="Navegação principal">
      <button type="button" className="bp-tab-button" onClick={() => navigate({ to: "/buspay/home" })}>
        <IonIcon icon={qrCodeOutline} />
        <span className="title-menu">
          Pagar
          <br /> Passagem
        </span>
      </button>
      <button type="button" className="bp-tab-button" onClick={() => navigate({ to: "/buspay/recarga" })}>
        <IonImg src="/assets/icon/recarga.png" className="icon-tabs" />
        <span className="title-menu">Recarga</span>
      </button>
      <button
        type="button"
        className="bp-tab-button"
        onClick={() => (carteirasUsuario.length ? navigate({ to: "/buspay/extrato" }) : avisoCarteira())}
      >
        <IonImg src="/assets/icon/extrato.png" className="icon-tabs" />
        <span className="title-menu">Extrato</span>
      </button>
      <button type="button" className="bp-tab-button" onClick={showMenu}>
        <IonIcon icon={ellipsisHorizontalSharp} />
        <span className="title-menu">Mais</span>
      </button>
    </nav>
  );
}
