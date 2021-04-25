/**
 * Throws an error if condition is falsy
 * @param condition 
 * @param message Optional error message
 */
export default function assert(condition: any, message?: string) {
  if (!condition) {
    throw new Error(`math.gl assertion ${message}`);
  }
}
