import { IconType } from 'react-icons';

interface WelcomeCardProps {
  title: string;
  desc: string;
  icon: IconType;
  setActiveTab: (activeTab: number) => void;
  activeTab: number;
  linkText: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  desc,
  icon: Icon,
  setActiveTab,
  activeTab,
  linkText,
}) => {
  return (
    <div className="border border-[color:var(--border-color)] rounded-md">
      <div className="p-5 flex items-center gap-x-12 justify-between">
        <div>
          <h3 className="text-2xl font-light">{title}</h3>
          <p className="text-sm text-[color:var(--text-secondary)]">{desc}</p>
        </div>
        <div>
          <span>{<Icon size={50} />}</span>
        </div>
      </div>
      <div
        className="border-t border-[color:var(--border-color)] p-5 hover:cursor-pointer hover:bg-gray-200 hover:dark:bg-slate-700 rounded-b-md transition-colors duration-300 ease-in-out"
        onClick={() => setActiveTab(activeTab)}
      >
        <p className="text-sm text-[color:var(--accent-primary)]">{linkText}</p>
      </div>
    </div>
  );
};

export default WelcomeCard;
