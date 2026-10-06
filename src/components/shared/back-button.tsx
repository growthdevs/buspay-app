import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useNavigate } from "@tanstack/react-router";

export function BackButton({ href = "/buspay/home", className }: { href?: string; className?: string }) {
  const navigate = useNavigate();
  return (
    <IonButtons>
      <IonButton
        className={className ?? "header-backbutton"}
        fill="clear"
        onClick={() => {
          if (window.history.length > 1) window.history.back();
          else navigate({ to: href });
        }}
      >
        <IonIcon icon={arrowBackOutline} slot="icon-only" />
      </IonButton>
    </IonButtons>
  );
}
