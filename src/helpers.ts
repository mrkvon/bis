import camelCase from 'lodash/camelCase'
import snakeCase from 'lodash/snakeCase'

export const wait = async (delay: number) => {
  await new Promise(resolve => setTimeout(resolve, delay))
}

export const sortCzech = (a: string, b: string) =>
  a.localeCompare(b, ['cs', 'sk'], {
    sensitivity: 'accent',
  })

export const sortCzechItem =
  <T extends string>(key: T) =>
  (a: Record<T, string>, b: Record<T, string>) => {
    return sortCzech(a[key], b[key])
  }

export const sortByCount = <T extends string>(a: T[]): T[] => {
  const map = a.reduce((map, element) => {
    map[element] = (map[element] ?? 0) + 1
    return map
  }, {} as { [key in T]: number })
  return (Object.keys(map) as T[]).sort(
    (a: keyof typeof map, b: keyof typeof map) => map[b] - map[a],
  )
}

/* extract plaintext from html string
https://stackoverflow.com/a/28899585
*/
export const html2plaintext = (html: string): string => {
  const span = document.createElement('span')
  span.innerHTML = html
  return span.textContent || span.innerText
}

/**
 * Take an object and change its keys to camelCase
 */
export const props2camelCase = (
  input: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [camelCase(key), value]),
  )

/**
 * Take an object and change its keys to snake_case
 */
export const props2snakeCase = (
  input: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [snakeCase(key), value]),
  )
