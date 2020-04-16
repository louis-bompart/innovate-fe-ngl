/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import { LitElement, html, customElement, css, property } from "lit-element";
import { TextArea } from "@material/mwc-textarea";
import { getCaretCoordinates } from "../../utils/caretPosition";

export interface ICaretSlottable extends LitElement {
  isInScrolledSection: boolean;
}

// TODO: support native textarea.
export interface ITextAreaSlottable extends TextArea {}
/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement("coveo-carret-position")
export class CoveoCarretPosition extends LitElement {
  private get textArea(): ITextAreaSlottable {
    return this.renderRoot
      .querySelector<HTMLSlotElement>("#form")
      .assignedElements()[0] as ITextAreaSlottable;
  }
  private get carret(): ICaretSlottable {
    return this.renderRoot
      .querySelector<HTMLSlotElement>("#carret")
      .assignedElements()[0] as ICaretSlottable;
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
    // Listen to input changes.
    this.textArea.addEventListener("input", (e: Event) => {
      this.updateCarretPosition();
    });

    this.textAreaScrollObserver = new MutationObserver(
      (mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.type === "attributes") {
            if (mutation.attributeName === "scrollTop") {
              this.updateCarretPosition();
            }
          }
        }
      }
    );

    this.textAreaDomLoadObserver = new MutationObserver(
      (mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.type === "childList") {
            const textarea = this.getNodeContainingTextArea(
              Array.from(mutation.addedNodes).find((node) => {
                if (node instanceof Element) {
                  return Boolean(this.getNodeContainingTextArea(node));
                }
              }) as Element
            );
            if (textarea) {
              let scrollTimeout: number;
              textarea.addEventListener("scroll", (event) => {
                if (scrollTimeout) {
                  window.cancelAnimationFrame(scrollTimeout);
                }
                scrollTimeout = window.requestAnimationFrame(
                  this.updateCarretPosition.bind(this)
                );
              });
              observer.disconnect();
            }
          }
        }
      }
    );

    this.textAreaDomLoadObserver.observe(this.textArea.renderRoot, {
      childList: true,
      subtree: true,
    });
  }

  private getNodeContainingTextArea(node: Element | LitElement): Element {
    if (node instanceof HTMLTextAreaElement) {
      return node;
    }
    return (node instanceof LitElement ? node.renderRoot : node).querySelector(
      "textarea"
    ) as Element;
  }

  public updateCarretPosition() {
    const nativeTextArea = this.getNodeContainingTextArea(
      this.textArea
    ) as HTMLTextAreaElement;
    const positions = getCaretCoordinates(
      nativeTextArea,
      nativeTextArea.selectionEnd,
      this.renderRoot
    );

    const targetRects = this.textArea.getBoundingClientRect();
    if (
      positions.top > targetRects.bottom ||
      positions.top < targetRects.top ||
      positions.left < targetRects.left ||
      positions.left > targetRects.right
    ) {
      this.carret.isInScrolledSection = false;
      return;
    }
    this.carret.isInScrolledSection = true;
    //TODO: Remove and add as option.
    this.carret.style.top = positions.top + positions.lineHeight * 0.85 + "px";
    this.carret.style.left = positions.left + "px";
  }
}
