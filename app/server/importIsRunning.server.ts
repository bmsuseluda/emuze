export let importIsRunning: boolean = false;

export const setImportIsRunning = (isRunning: boolean) => {
  importIsRunning = isRunning;
};

export const isImportRunning = () => importIsRunning;
