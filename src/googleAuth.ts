import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/webmasters",
];

interface ServiceAccountCredentials {
  type: string;
  project_id?: string;
  private_key_id?: string;
  private_key: string;
  client_email: string;
  client_id?: string;
  token_uri?: string;
}

function getServiceAccountCredentials(): ServiceAccountCredentials {
  const rawCredentials =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!rawCredentials) {
    throw new Error(
      "No se encontró la variable GOOGLE_SERVICE_ACCOUNT_JSON."
    );
  }

  let credentials: ServiceAccountCredentials;

  try {
    credentials = JSON.parse(
      rawCredentials
    ) as ServiceAccountCredentials;
  } catch {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON no contiene un JSON válido."
    );
  }

  if (
    credentials.type !== "service_account" ||
    !credentials.client_email ||
    !credentials.private_key
  ) {
    throw new Error(
      "Las credenciales no corresponden a una cuenta de servicio válida."
    );
  }

  credentials.private_key =
    credentials.private_key.replace(/\\n/g, "\n");

  return credentials;
}

export async function getAuthenticatedClient() {
  const credentials = getServiceAccountCredentials();

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  return auth;
}