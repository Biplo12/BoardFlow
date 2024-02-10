export default interface IDialogReducerInterface {
  currentDialog: string | null;
  isOpen: boolean;
  dialogProps: unknown | null;
}
