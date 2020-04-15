/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import { LitElement, html, customElement, property } from "lit-element";
import "./components/coveo-case-form/coveo-case-form";
/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement("coveo-app")
export class CoveoApp extends LitElement {
  /**
   * Implement `render` to define a template for your element.
   */
  render() {
    /**
     * Use JavaScript expressions to include property values in
     * the element template.
     */
    return html`<div>
      <coveo-case-form></coveo-case-form>
    </div>`;
  }
}
