import { BiLogoFacebook, BiLogoTiktok } from 'react-icons/bi';
import { BsInstagram, BsTwitter } from 'react-icons/bs';
import { FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Socials = ({ socials }: { socials: BusinessSocials }) => {
  return (
    <div className="flex items-center gap-x-3">
      {socials.Twitter && (
        <div className="">
          <Link
            to={socials.Twitter}
            className="w-[6rem] h-[6rem] group flex flex-col items-center justify-center gap-y-3 rounded-md hover:bg-[color:var(--border-color)] transition-all duration-300 ease-in-out"
          >
            <span className="text-white bg-blue-500 p-2 rounded-full transition-all duration-300 ease-in-out">
              <BsTwitter />
            </span>
            <span className="text-sm">Twitter</span>
          </Link>
        </div>
      )}
      {socials.Facebook && (
        <div>
          <Link
            to={socials.Facebook}
            className="w-[6rem] h-[6rem] group flex flex-col items-center justify-center gap-y-3 rounded-md hover:bg-[color:var(--border-color)] transition-all duration-300 ease-in-out"
          >
            <span className="text-white bg-blue-600 p-1 rounded-full transition-all duration-300 ease-in-out">
              <BiLogoFacebook size={22} />
            </span>
            <span className="text-sm">Facebook</span>
          </Link>
        </div>
      )}
      {socials.LinkedIn && (
        <div>
          <Link
            to={socials.LinkedIn}
            className="w-[6rem] h-[6rem] group flex flex-col items-center justify-center gap-y-3 rounded-md hover:bg-[color:var(--border-color)] transition-all duration-300 ease-in-out"
          >
            <span className="text-white bg-blue-900 p-2 rounded-full transition-all duration-300 ease-in-out">
              <FaLinkedinIn />
            </span>
            <span className="text-sm">LinkedIn</span>
          </Link>
        </div>
      )}
      {socials.Instagram && (
        <div>
          <Link
            to={socials.Instagram}
            className="w-[6rem] h-[6rem] group flex flex-col items-center justify-center gap-y-3 rounded-md hover:bg-[color:var(--border-color)] transition-all duration-300 ease-in-out"
          >
            <span className="instagram bg-[color:var(--border-color)] p-2 rounded-full transition-all duration-300 ease-in-out">
              <BsInstagram />
            </span>
            <span className="text-sm">Instagram</span>
          </Link>
        </div>
      )}
      {socials.Tiktok && (
        <div>
          <Link
            to={socials.Tiktok}
            className="w-[6rem] h-[6rem] group flex flex-col items-center justify-center gap-y-3 rounded-md hover:bg-[color:var(--border-color)] transition-all duration-300 ease-in-out"
          >
            <span className="bg-[#ff0050] text-[#000] p-2 rounded-full transition-all duration-300 ease-in-out">
              <BiLogoTiktok />
            </span>
            <span className="text-sm">Tiktok</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Socials;
