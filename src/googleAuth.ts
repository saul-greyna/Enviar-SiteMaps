import { readFile } from "node:fs/promises";
import { google } from "googleapis";

export async function getAuthenticatedClient() {
  const credentials = JSON.parse(
    await readFile("./auth/oauth.json", "utf8")
  );

  const token = JSON.parse(
    await readFile("./auth/token.json", "utf8")
  );

  const {
    client_id,
    client_secret,
    redirect_uris,
  } = credentials.installed;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  oauth2Client.setCredentials(token);

  return oauth2Client;
}