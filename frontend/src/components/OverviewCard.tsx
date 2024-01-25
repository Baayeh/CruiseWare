import { IconType } from 'react-icons';

interface OverviewCard {
  title: string;
  icon: IconType;
  numCreated: number;
  createdKeyword?: string;
  hasDeleted?: boolean;
  numDeleted?: number;
  deletedKeyword?: string;
}

const OverviewCard: React.FC<OverviewCard> = ({
  title,
  icon: Icon,
  numCreated,
  createdKeyword,
  hasDeleted,
  numDeleted,
  deletedKeyword,
}) => {
  return (
    <div className="summary-card w-full p-5 rounded-xl border border-[color:var(--border-color)]">
      <div className="summary-card-header flex justify-between items-center">
        <p className="text-sm">{title}</p>
        <Icon className="text-[color:var(--accent-primary)]" size={50} />
      </div>
      <div className="flex items-center gap-x-10">
        <div>
          <h2 className="font-bold text-4xl mt-2">
            {numCreated === 0
              ? 0
              : numCreated < 10
              ? `0${numCreated}`
              : numCreated}
          </h2>
          {createdKeyword && (
            <p className="text-xs text-[color:var(--text-secondary)]">
              {createdKeyword}
            </p>
          )}
        </div>
        {hasDeleted && numDeleted !== undefined && (
          <div>
            <h2 className="font-bold text-4xl mt-2">
              {numDeleted === 0
                ? 0
                : numDeleted < 10
                ? `0${numDeleted}`
                : numDeleted}
            </h2>
            <p className="text-xs text-[color:var(--text-secondary)]">
              {deletedKeyword}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewCard;
