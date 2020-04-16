export interface ICompletion {
  completion: string;
}
export type ICompletionResponse = ICompletion[];

export function getCompletionSuggestions(data: string): Array<string> {
  return ["Dog", "Fairy", "Potato", "YoLo"];
}
