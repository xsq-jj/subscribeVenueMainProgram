type LogArgs = unknown[]

const isDev = import.meta.env.DEV

export const logger = {
  info(...args: LogArgs) {
    if (isDev) {
      console.info(...args)
    }
  },
  warn(...args: LogArgs) {
    if (isDev) {
      console.warn(...args)
    }
  },
  error(...args: LogArgs) {
    if (isDev) {
      console.error(...args)
    }
  }
}
