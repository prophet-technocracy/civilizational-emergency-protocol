// Shared headless-Chromium launcher. Chromium comes from the @sparticuz/chromium
// npm tarball (no CDN download); its AL2023 shared libraries are extracted from
// the same package into /tmp/al2023libs.
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function launch({ width = 1440, height = 1000, scale = 1 } = {}) {
  return puppeteer.launch({
    args: [...chromium.args, "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    executablePath: await chromium.executablePath(),
    env: { ...process.env, FONTCONFIG_PATH: "/tmp/fonts", LD_LIBRARY_PATH: "/tmp/al2023libs/lib" },
    headless: "shell",
    defaultViewport: { width, height, deviceScaleFactor: scale }
  });
}
