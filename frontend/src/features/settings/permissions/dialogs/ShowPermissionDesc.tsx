import { Dialog } from 'primereact/dialog';
import { HiOutlineUserMinus } from 'react-icons/hi2';

interface PermissionDialog extends MainDialogProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  activeItem: Permission | null;
  setActiveItem: (item: Permission | null) => void;
}

const ShowPermissionDesc: React.FC<PermissionDialog> = ({
  activeItem,
  setActiveItem,
  position,
  visible,
  setVisible,
}) => {
  return (
    <Dialog
      header={activeItem?.name}
      visible={visible}
      onHide={() => setVisible(false)}
      onMaskClick={() => setVisible(false)}
      position={position}
      draggable={false}
      resizable={false}
      maskClassName="delete-mask"
      id="delete-dialog"
    >
      <div className="px-6">
        <h3 className="font-medium">Permission Description</h3>
        <div className="p-3 text-sm mt-3 border-l-[0.3rem] border-[color:var(--accent-secondary)] rounded-r-md bg-[color:var(--border-color)] bg-opacity-30">
          <p>{activeItem?.description}</p>
        </div>
      </div>
    </Dialog>
  );
};

export default ShowPermissionDesc;
