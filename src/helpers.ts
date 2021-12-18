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
