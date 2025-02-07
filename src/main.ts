require("dotenv").config();
import puppeteer, { Page } from "puppeteer";
import { LLMWorker } from "./utils/llmworker";
import { Action, ActionHistory } from "./types/actions";
import { sleep } from "openai/core";
import { getNodeList } from "./utils/helpers";

class BrowserAgent {
  private worker: LLMWorker;

  private page!: Page;

  constructor() {
    this.worker = new LLMWorker(process.env.API_KEY as string);
  }

  async startBrowser() {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-features=OptimizationGuideModelDownloading,OptimizationHintsFetching,OptimizationTargetPrediction,OptimizationHints",
        "--incognito",
        "--disable-web-security",
        "--disable-smooth-scrolling",
      ],
      defaultViewport: null,
    });
    const [page] = await browser.pages();
    this.page = page;
    return { browser, page };
  }

  async runTask(prompt: string) {
    if (!this.page) await this.startBrowser();
    const history: ActionHistory[] = [];
    while (true) {
      const nodes = await getNodeList(this.page);
      const result: Action[] = await this.worker.getAction({
        url: this.page.url(),
        title: await this.page.title(),
        nodes,
        prompt,
        history,
      });
      for (const action of result) {
        try {
          await this.page.waitForSelector("html");
        } catch {}
        console.log(
          `Action being performed: ${JSON.stringify(action.thought, null, 4)}`
        );
        if ((action as Action & { node: number }).node) {
          console.log(
            `Interacting with node: ${JSON.stringify(
              nodes[(action as Action & { node: number }).node]
            )}`
          );
        }
        switch (action.type) {
          case "click":
            await this.page.click(nodes[action.node].selector);
            break;
          case "navigate":
            await this.page.goto(action.url);
            break;
          case "scroll":
            await this.page.mouse.wheel({ deltaY: action.amount });
            break;
          case "select":
            await this.page.select(nodes[action.node].selector, action.value);
            break;
          case "type":
            await this.page.type(nodes[action.node].selector, action.value);
            break;
          case "wait":
            await sleep(action.amount);
            break;
          case "stop":
            console.log(`AI has ordered a stop: ${action.thought}`);
            return;
          case "press":
            await this.page.keyboard.press(action.key);
            break;
          default:
            console.log(
              "AI has given an invalid action: " +
                JSON.stringify(action, null, 4)
            );
        }
        history.push({
          url: this.page.url(),
          title: await this.page.title(),
          ...action,
        });
      }
    }
  }
}

(async () => {
  const agent = new BrowserAgent();
  await agent.runTask(
    "Go on youtube and find a really cool cat video and stay on the search page."
  );
  await agent.runTask("Navigate to a cool cat video in the search.");
  await sleep(100000000);
})();
