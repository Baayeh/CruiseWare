import { TbArrowBadgeRightFilled } from 'react-icons/tb';

interface TabMenuProps {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  labels: string[];
  setActiveItem: (item: UserProps | null) => void;
}

const TabMenu: React.FC<TabMenuProps> = ({
  activeTab,
  setActiveTab,
  labels,
  setActiveItem,
}) => {
  const changeTab = (index: number) => {
    setActiveTab(index);
    setActiveItem(null);
  };

  return (
    <ul className="flex items-center gap-x-2">
      <li className="text-gray-500">Settings</li>
      <li>
        <span className="text-gray-500">
          <TbArrowBadgeRightFilled />
        </span>
      </li>
      <li className="text-gray-500">Users</li>
      <li>
        <span className="text-gray-500">
          <TbArrowBadgeRightFilled />
        </span>
      </li>
      {labels.map((label, index) => (
        <li
          key={index}
          aria-label="tab"
          className={`${
            activeTab === index
              ? 'border-[#ff5722] text-[color:var(--accent-primary)]'
              : 'border-[color:var(--border-color)] text-gray-500 hover:border-gray-400 dark:hover:border-gray-700'
          } ${
            index === labels.length - 1
              ? 'rounded-e-md'
              : index === 0
              ? 'rounded-s-md'
              : ''
          } cursor-pointer border px-2 py-1 rounded-[5px] transition-all duration-300 ease-in-out`}
          onClick={() => changeTab(index)}
        >
          <span className="capitalize">{label}</span>
        </li>
      ))}
    </ul>
  );
};

export default TabMenu;
