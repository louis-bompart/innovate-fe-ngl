export interface ICompletion {
  completion: string;
}
export type ICompletionResponse = ICompletion[];
export interface ICompletionRequest {
  TEXT: string;
  LENGTH: number;
}

const LENGTH_NB = 5;
const DEMO = false;

export async function getCompletionSuggestions(
  data: string
): Promise<Array<string>> {
  const response = DEMO
    ? JSON.parse(
        '[{"completion":"I am very glad that I did"},{"completion":"I am not an economist and I"},{"completion":"I am not sure how many I"}]'
      )
    : await xhrWrapper({ TEXT: data, LENGTH: LENGTH_NB });

  if (response) {
    return response.map((res: ICompletion) => res.completion) as Array<string>;
  }
}

async function xhrWrapper(
  data: ICompletionRequest
): Promise<ICompletionResponse> {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 300) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject(this.responseText);
        }
      }
    });

    xhr.open("GET", "http://localhost:8081/complete");
    xhr.send(JSON.stringify(data));
  });
}
