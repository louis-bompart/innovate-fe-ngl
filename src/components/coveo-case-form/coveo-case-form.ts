/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import { LitElement, html, customElement, property, css } from "lit-element";
import "@material/mwc-textarea";
import "@material/mwc-textfield";
import "@material/mwc-list";

import { TextArea } from "@material/mwc-textarea";
import { getCaretCoordinates } from "../../utils/caretPosition";
import "../coveo-carret-position/coveo-carret-position";
import { CoveoCarretPosition } from "../coveo-carret-position/coveo-carret-position";

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement("coveo-case-form")
export class CoveoCaseForm extends LitElement {
  static canvas: HTMLCanvasElement;
  static CSSOffset: { x: number; y: number } = { x: 16, y: 8 };

  private get popup(): CoveoCarretPosition {
    return this.renderRoot.querySelector<CoveoCarretPosition>(
      "coveo-carret-position"
    );
  }

  observer: MutationObserver;
  static get styles() {
    return css`
      div {
        display: flex;
        flex-direction: column;
        margin: 1em;
      }
      div .coveo-field {
        margin: 0.5em;
      }
    `;
  }
  /**
   * Implement `render` to define a template for your element.
   */
  render() {
    /**
     * Use JavaScript expressions to include property values in
     * the element template.
     */

    return html`<div>
      <mwc-textfield
        class="coveo-field"
        outlined
        label="Subject"
      ></mwc-textfield>
      <mwc-textarea
        id="foo"
        class="coveo-field foo"
        outlined
        label="Description"
      ></mwc-textarea>
      <coveo-carret-position></coveo-carret-position>
    </div>`;
  }

  firstUpdated() {
    var baz: Element;

    const foo: TextArea = this.renderRoot.querySelector("#foo") as TextArea;
    const evtListener = (e: Event) => {
      const target = e.target;
      this.positionPopup(target);
    };
    foo.addEventListener("input", evtListener);
    this.observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "scrollTop") {
            this.positionPopup(foo);
          }
        }
      }
    });
    const domLoadObserve = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          const textarea = this.getNodeContainingArea(
            Array.from(mutation.addedNodes).find((node) => {
              if (node instanceof Element) {
                return Boolean(this.getNodeContainingArea(node));
              }
            }) as Element
          );
          requestAnimationFrame;
          if (textarea) {
            let scrollTimeout: number;
            textarea.addEventListener("scroll", (event) => {
              if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
              }
              scrollTimeout = window.requestAnimationFrame(
                this.positionPopup.bind(this, foo)
              );
            });
            observer.disconnect();
          }
        }
      }
    });
    domLoadObserve.observe(foo.renderRoot, { childList: true, subtree: true });
  }

  getNodeContainingArea(node: Element): Element {
    if (node instanceof HTMLTextAreaElement) {
      return node;
    }
    return node.querySelector("textarea");
  }

  private positionPopup(target: EventTarget) {
    if (target instanceof TextArea) {
      const positions = getCaretCoordinates(
        target.renderRoot.querySelector("textarea"),
        target.selectionEnd,
        this.renderRoot,
        { debug: false }
      );

      const targetRects = target.getBoundingClientRect();
      if (
        positions.top > targetRects.bottom ||
        positions.top < targetRects.top ||
        positions.left < targetRects.left ||
        positions.left > targetRects.right
      ) {
        this.popup.hidden = true;
        return;
      }
      this.popup.hidden = false;
      this.popup.style.top = positions.top + "px";
      this.popup.style.left = positions.left + "px";
    }
  }
}
