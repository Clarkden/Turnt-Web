import puppeteer from "puppeteer";
import { ENVIRONMENT } from "$env/static/private";
import chromium from "chrome-aws-lambda";

export async function POST(event: any) {
  const body = await event.request.json();
  try {
    let browser;
    if (ENVIRONMENT === "development") {
      browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox"],
      });
    } else {
      browser = await chromium.puppeteer.launch({
        args: chromium.args,
        headless: true,
      });
    }
    const page = await browser.newPage();
    await page.goto(body.url);
    await page.waitForNetworkIdle();

    const data = await page.evaluate(() => {
      const title = document.querySelector(".EventPage-name")?.textContent;
      const host = document.querySelector(".EventPage-groupName")?.textContent;
      const image = document
        .querySelector(".EventPage-eventImage")
        ?.getAttribute("src");
      const shortDescription = document.querySelector(
        ".EventPage-shortDescription"
      )?.textContent;
      const longDescription = document.querySelector(
        ".EventPage-descriptionSection"
      )?.textContent;
      const date = document.querySelectorAll(".text-xl")[1]?.textContent;
      const location = document
        .querySelector(".EventPage-detailText")
        ?.querySelector("tbody")
        ?.querySelector("tr")
        ?.querySelectorAll("td")[1]?.textContent;

      return {
        title,
        host,
        image,
        shortDescription,
        longDescription,
        date,
        location,
      };
    });

    await browser.close();

    return new Response(JSON.stringify(data));
  } catch (err) {
    throw new Error(String(err));
  }
}
