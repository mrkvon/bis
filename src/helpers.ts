export const wait = async (delay: number) => {
  await new Promise(resolve => setTimeout(resolve, delay))
}
