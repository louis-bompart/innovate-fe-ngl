/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import { LitElement, html, customElement, css } from "lit-element";
import { TextArea } from "@material/mwc-textarea";
import { getCaretCoordinates } from "../../utils/caretPosition";
/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement("coveo-carret-position")
export class CoveoCarretPosition extends LitElement {
  private get carret(): HTMLElement {
    return this.renderRoot
      .querySelector<HTMLSlotElement>("#carret")
      .assignedElements()[0] as HTMLElement;
  }
  private textAreaScrollObserver: MutationObserver;
  private textAreaDomLoadObserver: MutationObserver;

  static get styles() {
    return css`
      :host {
        display: inherit;
        flex-direction: inherit;
      }
      #carret::slotted(*) {
        position: absolute;
        margin-right: 0;
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 0;
      }
    `;
  }

  constructor() {
    super();
  }

  disconnectedCallback() {
    this.textAreaScrollObserver.disconnect();
    this.textAreaDomLoadObserver.disconnect();
  }

  /**
   * Implement `render` to define a template for your element.
   */
  render() {
    /**
     * Use JavaScript expressions to include property values in
     * the element template.
     */
    return html`
      <slot id="form" name="form"></slot>
      <slot id="carret" name="carret"></slot>
    `;
  }

  updated() {
    // Get the MWC-TextArea from the slot.
    // TODO: support native textarea.
    const mwcTextArea: TextArea = this.renderRoot
      .querySelector<HTMLSlotElement>("#form")
      .assignedElements()[0] as TextArea;

    // Listen to input changes.
    mwcTextArea.addEventListener("input", (e: Event) => {
      const target = e.target;
      this.updateCarretPosition(target);
    });

    this.textAreaScrollObserver = new MutationObserver(
      (mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.type === "attributes") {
            if (mutation.attributeName === "scrollTop") {
              this.updateCarretPosition(mwcTextArea);
            }
          }
        }
      }
    );

    this.textAreaDomLoadObserver = new MutationObserver(
      (mutationList, observer) => {
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
                  this.updateCarretPosition.bind(this, mwcTextArea)
                );
              });
              observer.disconnect();
            }
          }
        }
      }
    );
    this.textAreaDomLoadObserver.observe(mwcTextArea.renderRoot, {
      childList: true,
      subtree: true,
    });
  }

  private getNodeContainingArea(node: Element): Element {
    if (node instanceof HTMLTextAreaElement) {
      return node;
    }
    return node.querySelector("textarea");
  }

  private updateCarretPosition(target: EventTarget) {
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
        this.carret.hidden = true;
        return;
      }
      this.carret.hidden = false;
      this.carret.style.top = positions.top + "px";
      this.carret.style.left = positions.left + "px";
    }
  }
}
