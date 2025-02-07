import OpenAI from "openai";
import { prompts } from "./prompts";
import { Action, ActionHistory, InteractableElement } from "../types/actions";

export class LLMWorker {
  private openAIClient: OpenAI;

  constructor(apiKey: string) {
    this.openAIClient = new OpenAI({
      // baseURL: "https://api.deepseek.com",
      apiKey,
    });
  }

  async getAction(data: {
    prompt: string;
    title: string;
    nodes: InteractableElement[];
    url: string;
    history: ActionHistory[];
  }): Promise<Action[]> {
    const { prompt, nodes, url, title, history } = data;
    // Lets remove selector data from elements before sending to the LLM.
    const scrubbedNodes = [];
    for (const el of nodes) {
      scrubbedNodes.push({
        tag: el.tag,
        attributes: el.attributes,
        text: el.text,
      });
    }
    const chatCompletion = await this.openAIClient.chat.completions.create({
      messages: [
        { role: "system", content: prompts.SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({
            title,
            url,
            nodes: scrubbedNodes,
            request: prompt,
            history,
          }),
        },
      ],
      model: "gpt-4o",
    });
    const parsedResult =
      "[" +
      chatCompletion.choices[0].message.content?.split("[")[1]?.split("]")[0] +
      "]";
    return JSON.parse(parsedResult || "[]");
  }
}
