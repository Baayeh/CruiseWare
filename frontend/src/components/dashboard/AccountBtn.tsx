import { Menu } from 'primereact/menu';
import { RefObject, SyntheticEvent, useState } from 'react';
import { HiUser } from 'react-icons/hi';
import user_pic from '../../assets/images/user_pic.png';
import Image from './Image';

/**
 * Interface that defines the properties for the AccountBtn component.
 * @interface AccountBtnProps
 * @property {RefObject<Menu>} menu - The ref to the dropdown menu element.
 * @property {string} position - The position of the dropdown.
 * @property {string} name - The name of the user.
 * @property {string} role - The role of the user.
 */
interface AccountBtnProps {
  menu: RefObject<Menu>;
  position: string;
  name: string;
  role: string | undefined;
}

/**
 * Renders a button component for the account profile with optional menu dropdown.
 * @component
 * @implements {AccountBtnProps}
 *
 * @param {AccountBtnProps} menu - The ref to the dropdown menu element.
 * @param {string} position - The position of the dropdown.
 * @param {string} name - The name of the user.
 * @param {string} role - The role of the user.
 * @return {JSX.Element} The JSX representation of the account button component.
 */
const AccountBtn = ({
  menu,
  position,
  name,
  role,
}: AccountBtnProps): JSX.Element => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="taskbar-profile">
      <button
        type="button"
        className="taskbar-avatar group"
        onClick={(e: SyntheticEvent<Element, Event>) => menu.current?.toggle(e)}
        aria-controls={position}
        aria-haspopup
      >
        {!isImageLoaded ? (
          <div className="w-10 h-10 rounded-full bg-slate-500 text-2xl text-white flex justify-center items-center">
            <HiUser />
          </div>
        ) : null}
        <Image
          src={user_pic}
          alt={name}
          className={`${
            !isImageLoaded ? 'hidden' : ''
          } rounded-full w-8 h-8 border border-[color:var(--border-color)] p-1 group-hover:border-[color:var(--text-secondary)] transition-all duration-300 ease-in-out`}
          setIsImageLoaded={setIsImageLoaded}
        />
        <div className="text-start sm:text-end lg:text-start">
          <h3 className="text-xs font-medium text-[color:var(--text-primary)]">
            {name}
          </h3>
          <p className="text-xs text-[color:var(--text-secondary)] capitalize">
            {role}
          </p>
        </div>
      </button>
    </div>
  );
};
export default AccountBtn;
