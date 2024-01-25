import React from 'react';
import { ImProfile } from 'react-icons/im';
import { RiUser3Fill } from 'react-icons/ri';
import WelcomeCard from './WelcomeCard';

export interface WelcomeProps {
  setActiveTab: (activeTab: number) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ setActiveTab }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const getInitials = () => {
    return user && `${user.firstName[0]}${user.lastName[0]}`;
  };

  return (
    <section>
      <div className="w-[7rem] h-[7rem] rounded-full border border-[color:var(--border-color)] font-bold uppercase grid place-items-center mx-auto">
        <div className="bg-[color:var(--border-color)] h-[6rem] w-[6rem] rounded-full flex flex-wrap justify-center items-center">
          <p className="text-4xl">{getInitials()}</p>
        </div>
      </div>

      <div className="text-center mt-3">
        <h3 className="text-3xl font-normal">
          Welcome, {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-[color:var(--text-secondary)]">
          Manage your info, data, and security to make Cruise work better for
          you.
        </p>
      </div>

      <div className="my-5 grid grid-cols-2 gap-5">
        <WelcomeCard
          title="Personalization"
          desc="See and choose what data is saved to personalize your Cruise experience."
          icon={RiUser3Fill}
          activeTab={1}
          setActiveTab={setActiveTab}
          linkText="Manage your personal information"
        />
        <WelcomeCard
          title="My Organization"
          desc="Keep your organization's data organized and up-to-date for a smooth ride."
          icon={ImProfile}
          activeTab={2}
          setActiveTab={setActiveTab}
          linkText="Manage your organization"
        />
      </div>
    </section>
  );
};

export default Welcome;
