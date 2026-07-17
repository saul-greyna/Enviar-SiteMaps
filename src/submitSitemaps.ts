import { readFile } from "node:fs/promises";
import { google } from "googleapis";
import { getAuthenticatedClient } from "./googleAuth.js";

interface SitemapConfig {
  siteUrl: string;
  sitemapUrl: string;
}

export async function submitSitemaps() {
  const auth = await getAuthenticatedClient();

  const searchconsole = google.searchconsole({
    version: "v1",
    auth,
  });

  const sitemaps: SitemapConfig[] = JSON.parse(
    await readFile("./config/sitemaps.json", "utf8")
  );

  console.log("\n=================================");
  console.log("ENVIANDO SITEMAPS");
  console.log("=================================\n");

  let success = 0;
  let errors = 0;

  for (const sitemap of sitemaps) {
    try {
      console.log(`Enviando: ${sitemap.sitemapUrl}`);

      await searchconsole.sitemaps.submit({
        siteUrl: sitemap.siteUrl,
        feedpath: sitemap.sitemapUrl,
      });

      console.log("✓ Enviado correctamente\n");

      success++;

    } catch (error: any) {
      console.error(
        `✗ Error enviando ${sitemap.siteUrl}`
      );

      console.error(
        error.response?.data?.error?.message ??
        error.message
      );

      console.log("");

      errors++;
    }
  }

  console.log("=================================");
  console.log("RESUMEN");
  console.log("=================================");
  console.log(`Enviados: ${success}`);
  console.log(`Errores: ${errors}`);
  console.log("=================================\n");

  if (errors > 0) {
    throw new Error(`${errors} sitemap(s) no pudieron enviarse`);
  }