export function detectGPCSignal(): boolean {
  const gpc = (navigator as unknown as { globalPrivacyControl?: boolean | string }).globalPrivacyControl;
  if (gpc === true || gpc === "1" || gpc === 1) return true;
  return false;
}