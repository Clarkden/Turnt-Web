import puppeteer from "puppeteer-core";
import { BROWSERLESS_KEY } from "$env/static/private";
import { getAuth } from "firebase-admin/auth";

export async function POST(event: any) {
  try {
    const body = await event.request.json();
    const veryfyIdToken = await getAuth().verifyIdToken(
      event.request.headers.get("Authorization")!.split(" ")[1]
    );

    if (!veryfyIdToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_KEY}`,
    });

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
