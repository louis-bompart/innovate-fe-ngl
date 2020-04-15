/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import { LitElement, html, customElement, property, css } from "lit-element";
import "@material/mwc-textarea";
import "@material/mwc-textfield";
import "@material/mwc-list";

import "../coveo-carret-position/coveo-carret-position";
import "../coveo-text-completion/coveo-text-completion";
/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement("coveo-case-form")
export class CoveoCaseForm extends LitElement {
  static canvas: HTMLCanvasElement;
  static CSSOffset: { x: number; y: number } = { x: 16, y: 8 };

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
      <mwc-textfield class="coveo-field" outlined label="Subject">
      </mwc-textfield>
      <coveo-carret-position>
        <mwc-textarea
          slot="form"
          class="coveo-field foo"
          outlined
          label="Description"
        >
        </mwc-textarea>
        <coveo-text-completion slot="carret"></coveo-text-completion>
      </coveo-carret-position>
    </div>`;
  }
}
