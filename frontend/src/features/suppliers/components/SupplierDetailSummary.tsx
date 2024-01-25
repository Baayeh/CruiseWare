import moment from 'moment';
import { BiSolidCircle } from 'react-icons/bi';
import { FaRegAddressCard } from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone, HiOutlineUser } from 'react-icons/hi';
import noSelectionSvg from '../../../assets/images/no-selection.svg';
import { RequirePermission } from '../../../components';
import PERMISSIONS from '../../../data/permissions';

const SupplierDetailSummary = ({
  activeItem: supplier,
}: {
  activeItem: SupplierProps | null;
}) => {
  const getInitials = () => {
    return (
      supplier &&
      supplier?.name
        .split(' ')
        .map((word) => word[0])
        .join('')
    );
  };

  const getContent = () => {
    let content;

    if (!supplier) {
      content = (
        <>
          <img
            src={noSelectionSvg}
            alt="No selected supplier"
            className="w-[15rem] mx-auto"
          />
          <RequirePermission
            allowedPermissions={[PERMISSIONS.ReadSupplier]}
            element={<p className="mt-4">No access to view supplier info</p>}
          >
            <p className="mt-4">Select a supplier to view its details</p>
          </RequirePermission>
        </>
      );
    } else {
      content = (
        <>
          <div className="flex items-center gap-x-3">
            <div
              className={`rounded-full p-1 border border-[color:var(--border-color)] font-bold uppercase ${
                getInitials()!.length > 4 ? 'text-xs' : 'text-sm'
              }`}
            >
              <div className="bg-[color:var(--border-color)] h-[3.5rem] w-[3.5rem] rounded-full flex flex-wrap justify-center items-center">
                <p>{getInitials()}</p>
              </div>
            </div>
            <div className="font-bold">{supplier?.name}</div>
          </div>

          <div className="border-b py-4 border-[color:var(--border-color)]">
            <h3 className="mb-4 uppercase text-xs text-[color:var(--text-secondary)]">
              Supplier Details
            </h3>
            <ul>
              <li className="mb-2">
                <p className="text-sm flex items-center gap-x-3">
                  <span className="text-[color:var(--text-secondary)]">
                    <HiOutlineMail size={20} />
                  </span>
                  <span className="font-medium">{supplier?.email}</span>
                </p>
              </li>
              <li className="mb-2">
                <p className="text-sm flex items-center gap-x-3">
                  <span className="text-[color:var(--text-secondary)]">
                    <HiOutlinePhone size={20} />
                  </span>
                  <span className="font-medium">{supplier?.phone}</span>
                </p>
              </li>
              <li className="mb-2">
                <p className="text-sm flex items-center gap-x-3">
                  <span className="text-[color:var(--text-secondary)]">
                    <FaRegAddressCard size={20} />
                  </span>
                  <span className="font-medium">{supplier?.address}</span>
                </p>
              </li>
            </ul>
          </div>
          <div className="border-b py-4 border-[color:var(--border-color)]">
            <h3 className="mb-4 uppercase text-xs text-[color:var(--text-secondary)]">
              Supplier's Contact Person
            </h3>
            <ul>
              <li className="mb-2">
                <p className="text-sm flex items-center gap-x-3">
                  <span className="text-[color:var(--text-secondary)]">
                    <HiOutlineUser size={20} />
                  </span>
                  <span className="font-medium">
                    {supplier?.contactName ? supplier?.contactName : 'N/A'}
                  </span>
                </p>
              </li>
              <li className="mb-2">
                <p className="text-sm flex items-center gap-x-3">
                  <span className="text-[color:var(--text-secondary)]">
                    <HiOutlineMail size={20} />
                  </span>
                  <span className="font-medium">
                    {supplier?.contactEmail ? supplier?.contactEmail : 'N/A'}
                  </span>
                </p>
              </li>
              <li className="mb-2">
                <p className="text-sm flex items-center gap-x-3">
                  <span className="text-[color:var(--text-secondary)]">
                    <HiOutlinePhone size={20} />
                  </span>
                  <span className="font-medium">
                    {supplier?.contactPhone ? supplier?.contactPhone : 'N/A'}
                  </span>
                </p>
              </li>
            </ul>
          </div>
          <div className="pt-4">
            <h3 className="mb-1 uppercase text-xs text-[color:var(--text-secondary)]">
              Created
            </h3>
            <p className="flex gap-x-2 items-center text-sm text-[color:var(--text-secondary)]">
              by{' '}
              <span className="font-medium text-[color:var(--text-primary)]">
                {supplier?.createdBy}
              </span>
              <span>
                <BiSolidCircle size={7} />
              </span>
              <span className="font-medium text-[color:var(--text-primary)]">
                {moment(supplier?.createdAt).calendar()}
              </span>
            </p>
          </div>
          <div className="py-4">
            <h3 className="mb-1 uppercase text-xs text-[color:var(--text-secondary)]">
              Updated
            </h3>
            <p className="flex gap-x-2 items-center text-sm text-[color:var(--text-secondary)]">
              by{' '}
              <span className="font-medium text-[color:var(--text-primary)]">
                {supplier?.updatedBy}
              </span>
              <span>
                <BiSolidCircle size={7} />
              </span>
              <span className="font-medium text-[color:var(--text-primary)]">
                {moment(supplier?.updatedAt).calendar()}
              </span>
            </p>
          </div>
        </>
      );
    }

    return content;
  };

  return (
    <div
      className={`hidden col-span-2 border border-[color:var(--border-color)] rounded-lg px-4 py-6 min-h-[390px] lg:sticky top-[6rem] self-start ${
        !supplier ? 'lg:grid place-content-center' : 'lg:block'
      }`}
    >
      {getContent()}
    </div>
  );
};

export default SupplierDetailSummary;
