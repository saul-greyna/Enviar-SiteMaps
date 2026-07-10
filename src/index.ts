import { submitSitemaps } from "./submitSitemaps.js";

async function main() {
  try {
    await submitSitemaps();
  } catch (error) {
    console.error("\nError ejecutando el proceso:");
    console.error(error);
    process.exit(1);
  }
}

main();