import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { SyntheticEvent, useRef, useState } from 'react';
import { BsBoxSeamFill, BsThreeDotsVertical } from 'react-icons/bs';
import { Image, RequirePermission } from '../../../components';
import PERMISSIONS from '../../../data/permissions';

interface ProductCardProps {
  item: ProductProps;
  scrollPosition: { x: number; y: number };
  showEditDialog: (item: ProductProps) => void;
  showDeleteDialog: (item: ProductProps) => void;
}

/**
 * Renders a product card component.
 *
 * @param {ProductCardProps} item - The item to display in the card.
 * @param {number} scrollPosition - The current scroll position.
 * @param {Function} showEditDialog - A callback function to show the edit dialog.
 * @return {ReactElement} The rendered product card.
 */
/**
 * Renders a product card component.
 *
 * @param {ProductCardProps} item - The item to display in the card.
 * @param {number} scrollPosition - The current scroll position.
 * @param {Function} showEditDialog - A callback function to show the edit dialog.
 * @return {ReactElement} The rendered product card.
 */
const ProductCard: React.FC<ProductCardProps> = ({
  item,
  scrollPosition,
  showEditDialog,
  showDeleteDialog,
}) => {
  // const inventory = inventories.find((i) => i.id === item.inventoryId);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const menuRight = useRef<Menu>(null);

  const items: MenuItem[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => {
        showEditDialog(item);
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        showDeleteDialog(item);
      },
    },
  ];

  const openMenu = (e: SyntheticEvent<Element, Event>) => {
    e.stopPropagation();

    menuRight.current!.toggle(e);
  };

  return (
    <>
      <div className="relative z-10 product_card group">
        <div className="product_img bg-slate-500 grid place-items-center rounded-lg w-full h-48 overflow-hidden">
          {!isImageLoaded ? (
            <div className="text-white text-4xl h-[inherit] flex flex-col justify-center items-center">
              <BsBoxSeamFill />
            </div>
          ) : null}
          {item.photo ? (
            <Image
              src={item.photo}
              alt={item.name}
              className={`${
                !isImageLoaded ? 'invisible' : ''
              } group-hover:scale-[1.2] w-full h-48 object-cover`}
              setIsImageLoaded={setIsImageLoaded}
              scrollPosition={scrollPosition}
              width="100%"
            />
          ) : (
            <div className="text-white text-4xl h-[inherit] flex flex-col justify-center items-center">
              <BsBoxSeamFill />
            </div>
          )}
        </div>
        <div className="card_content my-2">
          <div className="relative flex justify-between items-center">
            <h2 className="font-bold">
              {item.name.length > 15
                ? `${item.name.slice(0, 15)}...`
                : item.name}
            </h2>
            <RequirePermission
              allowedPermissions={[
                PERMISSIONS.UpdateProduct,
                PERMISSIONS.DeleteProduct,
              ]}
            >
              <button
                type="button"
                className="p-2 rounded-full hover:bg-orange-500/10"
                onClick={openMenu}
                aria-controls={item.id.toString()}
                aria-haspopup
              >
                <BsThreeDotsVertical />
              </button>
            </RequirePermission>
          </div>
          <div className="text-sm my-2 flex items-center gap-x-2">
            <p className="font-medium">
              {item.quantity} unit<span>{item.quantity > 1 ? 's' : ''}</span>
            </p>
            <span>|</span>
            <p className="text-[color:var(--text-secondary)]">$ {item.price}</p>
          </div>
        </div>
      </div>
      <RequirePermission
        allowedPermissions={[
          PERMISSIONS.UpdateProduct,
          PERMISSIONS.DeleteProduct,
        ]}
      >
        <Menu
          model={items}
          popup
          ref={menuRight}
          id={item.id.toString()}
          popupAlignment="right"
        />
      </RequirePermission>
    </>
  );
};
export default ProductCard;
