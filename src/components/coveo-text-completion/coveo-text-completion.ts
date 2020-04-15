/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import { LitElement, html, customElement, css } from "lit-element";

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement("coveo-text-completion")
export class CoveoTextCompletion extends LitElement {
  static get styles() {
    return css`
      :host {
        z-index: 2;
        margin-right: 0;
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 0;
        width: 20px;
        height: 20px;
        background-color: red;
      }

      :host([hidden]) {
        display: none;
      }
    `;
  }
  constructor() {
    super();
    this.hidden = true;
  }
  /**
   * Implement `render` to define a template for your element.
   */
  render() {
    /**
     * Use JavaScript expressions to include property values in
     * the element template.
     */
    return html``;
  }
}
