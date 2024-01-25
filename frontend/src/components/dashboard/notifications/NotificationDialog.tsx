import { Dialog } from 'primereact/dialog';

/**
 * Main Dialog
 * @interface MainDialogProps
 * @property {boolean} visible - boolean to show/hide the dialog component
 * @property {function} setVisible - function to set the visibility of the dialog
 */

/**
 * Renders a notification dialog component.
 * @implements {MainDialogProps}
 * @component
 * @example
 * let visible = false;
 * const setVisible = () => setVisible(!visible);
 * return (
 * <NotificationDialog visible={visible} setVisible={setVisible} />
 * )
 *
 * @param {boolean} visible - boolean to show/hide the dialog component
 * @param {function} setVisible - function to set the visibility of the dialog
 * @return {JSX.Element} the notification dialog component
 */
const NotificationDialog = ({
  visible,
  setVisible,
}: MainDialogProps): JSX.Element => {
  return (
    <>
      <Dialog
        header={'headerContent'}
        visible={visible}
        position="top-right"
        onHide={() => setVisible(false)}
        footer={'footerContent'}
        draggable={false}
        resizable={false}
        maskClassName="notification-mask"
        id="notification-dialog"
      >
        <div className="notifications-body mt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </Dialog>
    </>
  );
};
export default NotificationDialog;
