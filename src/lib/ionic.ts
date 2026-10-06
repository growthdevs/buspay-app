import { setupIonicReact } from "@ionic/react";
import { addIcons } from "ionicons";
import {
  arrowBackOutline,
  cameraOutline,
  cardOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  chevronDownOutline,
  chevronForwardOutline,
  chevronUpOutline,
  closeCircleOutline,
  closeOutline,
  copyOutline,
  documentTextOutline,
  ellipsisHorizontalSharp,
  eyeOffOutline,
  eyeOutline,
  helpCircle,
  informationCircleOutline,
  notificationsOutline,
  qrCodeOutline,
  shareOutline,
  timerOutline,
} from "ionicons/icons";

/**
 * O app original roda em Capacitor/Android, onde o Ionic resolve o modo como
 * `md`. Fixar o modo mantém o visual idêntico também no navegador.
 */
setupIonicReact({
  mode: "md",
  innerHTMLTemplatesEnabled: true,
});

addIcons({
  "arrow-back-outline": arrowBackOutline,
  "camera-outline": cameraOutline,
  "card-outline": cardOutline,
  "checkmark-circle": checkmarkCircle,
  "checkmark-circle-outline": checkmarkCircleOutline,
  "chevron-down-outline": chevronDownOutline,
  "chevron-forward-outline": chevronForwardOutline,
  "chevron-up-outline": chevronUpOutline,
  "close-circle-outline": closeCircleOutline,
  "close-outline": closeOutline,
  "copy-outline": copyOutline,
  "document-text-outline": documentTextOutline,
  "ellipsis-horizontal-sharp": ellipsisHorizontalSharp,
  "eye-off-outline": eyeOffOutline,
  "eye-outline": eyeOutline,
  "help-circle": helpCircle,
  "information-circle-outline": informationCircleOutline,
  "notifications-outline": notificationsOutline,
  "qr-code-outline": qrCodeOutline,
  "share-outline": shareOutline,
  "timer-outline": timerOutline,
});
