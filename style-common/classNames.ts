/**
 * Join the non empty strings to form a class name
 * @param className
 */
export default function classNames(...className: Array<string | null | undefined>): string {
  if (!className) {
    return '';
  }
  let c = '';
  for (const n of className) {
    if (n) {
      c = c.length === 0 ? n : c + ' ' + n;
    }
  }

  return c;
}
