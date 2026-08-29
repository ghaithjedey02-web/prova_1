/**
 * Redaction applied to anything written to logs or telemetry.
 *
 * We process client business email containing named individuals at the client's
 * own customers. Under the DPA we are the processor; leaking that data into logs
 * or a third-party observability tool is a reportable breach. Logs get redacted
 * content or they get nothing.
 */

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
// Italian phone numbers, with or without +39, spaces, dots or dashes.
const PHONE = /(?:\+39[\s.-]?)?(?:0\d{1,3}|3\d{2})[\s.-]?\d{5,8}\b/g;
// Partita IVA / Codice Fiscale (numeric 11-digit form).
const VAT = /\b(?:IT)?\d{11}\b/g;
const IBAN = /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g;

export function redact(input: string): string {
  return input
    .replace(EMAIL, '[EMAIL]')
    .replace(IBAN, '[IBAN]')
    .replace(VAT, '[VAT]')
    .replace(PHONE, '[PHONE]');
}

/** Truncate then redact. Order matters: never log a raw prefix. */
export function safeSnippet(input: string, maxChars = 200): string {
  return redact(input.slice(0, maxChars));
}
