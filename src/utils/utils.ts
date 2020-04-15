export function debounce(func: { apply: (arg0: any, arg1: IArguments) => void; }, wait: number, immediate?: undefined) {
  var timeout: number;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}
