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
/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement("coveo-case-form")
export class CoveoCaseForm extends LitElement {
  static canvas: HTMLCanvasElement;
  static CSSOffset: { x: number; y: number } = { x: 16, y: 8 };
  popup: HTMLElement;
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
    </div>`;
  }

  firstUpdated() {
    const foo: TextArea = this.shadowRoot.getElementById("foo") as TextArea;
    const evtListener = (e: Event) => {
      const target = e.target;
      setTimeout(() => {
        if (target instanceof TextArea) {
          const positions = getCaretCoordinates(
            target.shadowRoot.activeElement as TextArea,
            target.selectionEnd,
            this.shadowRoot.firstElementChild,
            { debug: false }
          );
          if (!this.popup) {
            this.popup = document.createElement("div");
            this.popup.style.backgroundColor = "red";
            this.popup.style.position = "absolute";
            this.popup.style.zIndex = "2";
            this.shadowRoot.firstElementChild.append(this.popup);
            this.popup.style.marginRight = "0";
            this.popup.style.marginTop = "0";
            this.popup.style.marginBottom = "0";
            this.popup.style.marginLeft = "0";
            this.popup.style.width = "0";
            this.popup.style.height = "0";
          }
          this.popup.style.width = positions.fontSize + "px";
          this.popup.style.height = this.popup.style.width;
          this.popup.style.marginLeft = positions.fontSize * 0 + "px";
          this.popup.style.top = positions.top + "px";
          this.popup.style.left = positions.left + "px";
        }
      }, 50);
    };
    foo.addEventListener("input", evtListener);
    // foo.addEventListener("wheel", evtListener);
    // foo.addEventListener("keypress", evtListener);
  }
}
