export default function (callback) {
  const readyState = document.readyState,
        doScroll = document.documentElement.doScroll;

  if (readyState === "complete" || (readyState !== "loading" && !doScroll)) {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}
