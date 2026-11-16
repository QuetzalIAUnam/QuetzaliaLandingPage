export type RegistrationType = 'speaker' | 'sponsor' | 'community' | 'attendee';

export type RegistrationStatus = 'pendiente' | 'aprobado' | 'lista_espera' | 'rechazado';

export interface ConsentRecord {
  privacyNotice: boolean;         // Obligatoria (Aviso de privacidad)
  imageBasic: boolean;            // Imagen básica hasta 12 meses
  recording: boolean;             // Grabación del evento
  materials: boolean;             // Distribución de materiales/ponencia
  shareEmailWithSponsors: boolean;// Compartir correo con patrocinadores
  clips: boolean;                 // Clips / testimonios
  futureEditions: boolean;        // Notificaciones para futuras ediciones
}

export interface Registration {
  id: string;
  userId: string;
  type: RegistrationType;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
  email: string;
  fullName: string;
  chosenName?: string;
  legalName?: string;
  phone?: string;
  organization?: string;
  talkTitle?: string;
  talkMaterials?: string;
  photoPath?: string;
  logoPath?: string;
  consent: ConsentRecord;
  consentVersion: string;
  consentTimestamp: string;
  adminNote?: string;
  approvedBy?: string;
  approvedAt?: string;
  resendContactId?: string;
  resendSyncError?: string;
}

export interface BroadcastRecord {
  id: string;
  broadcastId: string;
  subject: string;
  message: string;
  html: string;
  sentAt: string;
  sentBy: string;
  audienceCount?: number;
  status: string;
}

export const MAX_APPROVED = 400;
