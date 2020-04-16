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
import { TextArea } from "@material/mwc-textarea";
import { getCompletionSuggestions } from "../../utils/API";
import { CoveoTextCompletion } from "../coveo-text-completion/coveo-text-completion";
import { CoveoCarretPosition } from "../coveo-carret-position/coveo-carret-position";
/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement("coveo-case-form")
export class CoveoCaseForm extends LitElement {
  static canvas: HTMLCanvasElement;
  static CSSOffset: { x: number; y: number } = { x: 16, y: 8 };

  observer: MutationObserver;
  description: TextArea;
  completion: CoveoTextCompletion;
  private get carretPosition(): CoveoCarretPosition {
    return this.renderRoot.querySelector(
      "coveo-carret-position"
    ) as CoveoCarretPosition;
  }

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

  firstUpdated() {
    this.description = this.renderRoot.querySelector<TextArea>(
      "coveo-carret-position mwc-textarea"
    );
    this.completion = this.renderRoot.querySelector<CoveoTextCompletion>(
      "coveo-carret-position coveo-text-completion"
    );
    this.completion.addEventListener("text-selected", (event: CustomEvent) => {
      const valueBeforeCaret =
        this.description.value.substring(0, this.description.selectionEnd) +
        event.detail.text;
      this.description.value =
        valueBeforeCaret +
        this.description.value.substring(this.description.selectionEnd);
      this.completion.hidden = true;
      this.description.focus();

      this.description.updateComplete.then(() => {
        this.description.setSelectionRange(
          valueBeforeCaret.length,
          valueBeforeCaret.length,
          "forward"
        );
      });
    });
    this.description.addEventListener(
      "input",
      this.onDescriptionInput.bind(this)
    );
    this.description.addEventListener("keyup", (event: KeyboardEvent) => {
      switch (event.key) {
        case "Up":
        case "Down":
        case "Left":
        case "Right":
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          this.carretPosition.updateCarretPosition();
          this.onDescriptionInput(event);
          break;
        case " ":
          if (event.ctrlKey) {
            this.carretPosition.updateCarretPosition();
            this.onDescriptionInput(event);
            this.completion.hidden = false;
          }
          break;
        case "Esc": // IE/Edge specific value
        case "Escape":
          this.completion.hidden = true;
      }
    });
    this.description.addEventListener("mouseup", (event: MouseEvent) => {
      this.completion.hidden = true;
    });
  }

  descriptionCondition: (input: string, fieldValue: string) => boolean = (
    input,
    fieldValue
  ) => {
    const trimmed = input.trim();
    return (
      trimmed.length < input.length &&
      trimmed[trimmed.length - 1] !== input[input.length - 1]
    );
  };

  async onDescriptionInput(event: Event) {
    const description = event.target as TextArea;
    const inputBeforeCaret = description.value.substr(
      0,
      description.selectionEnd
    );

    //TODO: Debounce to avoid spamming the API if people fall asleep on their keyboards.
    this.completion.suggestions = await getCompletionSuggestions(
      inputBeforeCaret
    );
  }
}
