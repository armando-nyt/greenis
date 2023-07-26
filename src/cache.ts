import puppeteer from "puppeteer";

let page: puppeteer.Page | null = null;
let browser: puppeteer.Browser | null = null;

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();

  // Create a page
  page = await browser.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
})();

export async function getCachedValue(key: string) {
  if (!page) return "no page";
  return await page.evaluate((arg) => window.localStorage.getItem(arg), key);
}

export async function saveValue(key: string, value: string) {
  if (!page) return "no page";
  const result = await page.evaluate(
    (args) => {
      window.localStorage.setItem(args[0], args[1]);
      console.log(args);
      console.log({ storage: localStorage });
      return args[1];
    },
    [key, value]
  );
  return result;
}
