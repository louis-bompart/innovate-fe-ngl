export interface ICompletion {
  completion: string;
}
export type ICompletionResponse = ICompletion[];
export interface ICompletionRequest {
  TEXT: string;
  LENGTH: number;
}

const LENGTH_NB = 5;

export async function getCompletionSuggestions(
  data: string
): Promise<Array<string>> {
  const response = await xhrWrapper({ TEXT: data, LENGTH: LENGTH_NB });
  if (response) {
    return JSON.parse(response) as Array<string>;
  }
}

async function xhrWrapper(data: ICompletionRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 300) {
          resolve(this.responseText);
        } else {
          reject(this.responseText);
        }
      }
    });

    xhr.open("GET", "http://localhost:8081/complete");
    xhr.send(JSON.stringify(data));
  });
}
