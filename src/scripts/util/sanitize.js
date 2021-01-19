import Dompurify from "dompurify";


/**
 * Returns sanitized string prior to render.
 * @param {string} string 
 */
export default function sanitize(v) {
  return Dompurify.sanitize(v);
}