import { RiEditFill } from 'react-icons/ri';

interface BusinessLocationProps {
  location: BusinessLocation;
}

const BusinessLocation: React.FC<BusinessLocationProps> = ({ location }) => {
  return (
    <div className="mt-1">
      <div className="flex items-center gap-x-6">
        <h1 className="text-[color:var(--text-secondary)] font-semibold">
          {location.name}
        </h1>
        <button
          type="button"
          className="border border-dotted border-[color:var(--border-color)] p-1 rounded text-sm hover:text-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-all duration-300 ease-in-out"
          // onClick={() => setEditVisible(true)}
        >
          <span>
            <RiEditFill />
          </span>
        </button>
      </div>
    </div>
  );
};

export default BusinessLocation;
