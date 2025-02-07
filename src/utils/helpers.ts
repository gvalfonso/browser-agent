import { Page } from "puppeteer";
import { InteractableElement } from "../types/actions";

export async function getNodeList(page: Page): Promise<InteractableElement[]> {
  const elements = await page.evaluate(() => {
    function processName(newElId: any) {
      // For selectors that have numbers as the first character
      const badChars = " /:;'\"[]{},<>?!@#$%^&*()+=~`".split("");
      for (const char of badChars) {
        newElId = newElId.replaceAll(char, "\\" + char);
      }
      if ("1234567890".split("").includes(newElId[0])) {
        newElId = "\\3" + newElId[0] + " " + newElId.slice(1);
      }
      return newElId;
    }

    function fullPath(el: any) {
      var names = [];
      while (el.parentNode) {
        var elid = el.getAttribute("id");
        if (elid) {
          var newElId = processName(elid);
          names.unshift(
            "#" + newElId.replace(/#/g, "\\#").replace(/\./g, "\\.")
          );
          break;
        } else {
          if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);
          else {
            for (
              var c = 1, e = el;
              e.previousElementSibling;
              e = e.previousElementSibling, c++
            );
            names.unshift(el.tagName + ":nth-child(" + c + ")");
          }
          el = el.parentNode;
        }
      }
      if (document.querySelectorAll(names.join(" > ")).length > 1) {
        if (el.getAttribute("name")) {
          return names.join(" > ") + `[name=\"${el.getAttribute("name")}\"]`; // For selectors that have 2 or more elements
        }
      }
      return names.join(" > ");
    }

    function isHidden(el: any) {
      var style = window.getComputedStyle(el);
      return style.display === "none";
    }

    const interactableSelectors = [
      "input",
      "button",
      "select",
      "textarea",
      "a",
      "label",
    ];
    const elements = Array.from(
      document.querySelectorAll(interactableSelectors.join(","))
    )
      .filter((ele) => !isHidden(ele))
      .map((el) => {
        return {
          tag: el.tagName,
          selector: fullPath(el),
          attributes: Object.fromEntries(
            el.getAttributeNames().map((attr) => [attr, el.getAttribute(attr)])
          ),
          text: el.textContent?.trim() || "",
        };
      })
      .filter(
        (element) =>
          (element.text || "")?.length < 200 &&
          element.attributes.type !== "hidden"
      );
    return elements;
  });
  const visibleElements: InteractableElement[] = [];
  for (const el of elements) {
    if (await elementIsVisible(page, el.selector)) {
      visibleElements.push(el);
    }
  }
  return visibleElements;
}

export async function elementIsVisible(page: Page, selector: string) {
  try {
    await page.waitForSelector(selector, {
      visible: true,
      timeout: 10,
    });
    return true;
  } catch (e) {}
  return false;
}

export async function checkIfLoaded(page: Page) {
  return await page.evaluate(() => {
    return document.readyState === "complete";
  });
}

export async function waitTillLoaded(page: Page) {
  return new Promise((res, rej) => {
    const checkInterval = setInterval(async () => {
      if (await checkIfLoaded(page)) {
        res(true);
        clearInterval(checkInterval);
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(checkInterval);
      res(false);
    }, 60000);
  });
}
