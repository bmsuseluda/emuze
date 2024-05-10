export interface ErrorDialog {
  title?: string;
  stacktrace?: string;
}

const errorDialog: ErrorDialog = {};

export const getErrorDialog = () => errorDialog;

export const setErrorDialog = (title: string, stacktrace: string) => {
  errorDialog.title = title;
  errorDialog.stacktrace = stacktrace;
};

export const resetErrorDialog = () => {
  errorDialog.title = undefined;
  errorDialog.stacktrace = undefined;
};
