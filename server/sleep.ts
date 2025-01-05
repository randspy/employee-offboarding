export const defaultTimeout = 500;

export const sleep = (ms: number = defaultTimeout) =>
  new Promise((resolve) => setTimeout(resolve, ms));
