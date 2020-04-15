/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import { LitElement, html, customElement, css } from "lit-element";

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement("coveo-carret-position")
export class CoveoCarretPosition extends LitElement {
  static get styles() {
    return css`
      :host {
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
