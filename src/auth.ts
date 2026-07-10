import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { URL } from "node:url";
import open from "open";
import { google } from "googleapis";

const PORT = 3333;

const SCOPES = [
  "https://www.googleapis.com/auth/webmasters",
];

async function main() {
  const credentials = JSON.parse(
    await readFile("./auth/oauth.json", "utf8")
  );

  const { client_id, client_secret, redirect_uris } =
    credentials.installed;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    `http://localhost:${PORT}`
  );

  const server = createServer(async (req, res) => {
    try {
      const reqUrl = new URL(
        req.url!,
        `http://localhost:${PORT}`
      );

      const code = reqUrl.searchParams.get("code");

      if (!code) {
        res.writeHead(400);
        res.end("Authorization code not found.");
        return;
      }

      const { tokens } = await oauth2Client.getToken(code);

      await writeFile(
        "./auth/token.json",
        JSON.stringify(tokens, null, 2)
      );

      res.writeHead(200, {
        "Content-Type": "text/html",
      });

      res.end(`
        <h2>Autenticacion completada</h2>
        <p>Puedes cerrar esta ventana.</p>
      `);

      console.log(" token.json generado correctamente.");

      server.close();
    } catch (err) {
      console.error(err);

      res.writeHead(500);
      res.end("OAuth Error");
    }
  });

  server.listen(PORT, async () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: SCOPES,
    });

    console.log("Abriendo navegador...");

    await open(authUrl);
  });
}

main().catch(console.error);