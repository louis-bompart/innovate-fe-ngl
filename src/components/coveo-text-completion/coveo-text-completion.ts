/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import { LitElement, html, customElement, css, property } from "lit-element";
import "@material/mwc-list/mwc-list-item";
import "@material/mwc-list/mwc-list";
import { List } from "@material/mwc-list/mwc-list";
import { ListItemBase } from "@material/mwc-list/mwc-list-item-base";

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
      }

      :host([hidden]) {
        display: none;
      }

      #styled {
        --mdc-list-vertical-padding: 0px;
        --mdc-list-side-padding: 0.5em;
        border-radius: 10px;
        overflow: hidden;
      }

      #styled > mwc-list-item {
        height: 1.25rem;
      }
    `;
  }
  constructor() {
    super();
    this.isOpened = false;
    this.hidden = true;
    this.suggestions = [];
  }

  @property({ type: Boolean, reflect: true })
  isOpened: boolean;

  @property({ type: Boolean, reflect: true })
  isInScrolledSection: boolean;

  @property({ type: Array })
  suggestions: Array<string>;

  /**
   * Implement `render` to define a template for your element.
   */
  render() {
    /**
     * Use JavaScript expressions to include property values in
     * the element template.
     */
    return html`<mwc-list id="styled">
      ${this.suggestions.map(
        (suggestion) =>
          html`<mwc-list-item value=${suggestion.toLowerCase()}
            >${suggestion}</mwc-list-item
          >`
      )}
    </mwc-list>`;
  }

  attributeChangedCallback() {
    this.hidden = !this.isOpened || !this.isInScrolledSection;
  }

  private mwcList: List;

  onAction = () => {
    if (!this.hidden) {
      if (this.mwcList.selected instanceof ListItemBase) {
        const value = this.mwcList.selected.value;
        this.mwcList.select(null);
        let bubbleUpEvent = new CustomEvent("text-selected", {
          detail: {
            text: value,
          },
        });
        this.dispatchEvent(bubbleUpEvent);
      }
    }
  };

  firstUpdated() {
    this.mwcList = this.renderRoot.querySelector<List>("#styled");
    this.mwcList.addEventListener("action", this.onAction);
  }
}
