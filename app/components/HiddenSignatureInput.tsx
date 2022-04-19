import { ClientOnly } from "remix-utils";

function pad(str: string, size: number): string {
  return (new Array(size + 1).join("0") + str).slice(-size);
}

function browserSignature(): string {
  const windowObj = window || global;

  function windowObjCount() {
    const keys = [];
    for (let i in windowObj) {
      keys.push(i);
    }
    return keys.length.toString(36);
  }

  // Browser User Agent count
  const navi = navigator.userAgent.length.toString(36);
  const padString = pad(navi + windowObjCount(), 4);
  // Browser screen specific properties
  const width = windowObj.screen.width.toString(36);
  const height = windowObj.screen.height.toString(36);
  const availWidth = windowObj.screen.availWidth.toString(36);
  const availHeight = windowObj.screen.availHeight.toString(36);
  const colorDepth = windowObj.screen.colorDepth.toString(36);
  const pixelDepth = windowObj.screen.pixelDepth.toString(36);

  return atob(
    padString +
      width +
      height +
      availWidth +
      availHeight +
      colorDepth +
      pixelDepth
  );
}

export default function HiddenSignatureInput() {
  return (
    <ClientOnly>
      {() => (
        <input type="hidden" name="signature" value={browserSignature()} />
      )}
    </ClientOnly>
  );
}
