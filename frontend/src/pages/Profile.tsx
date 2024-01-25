import { useEffect, useState } from 'react';
import '../assets/css/AccountSettings.scss';
import {
  AccountNav,
  CompanyInfo,
  PersonalInfo,
  Welcome,
} from '../features/account-settings';

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="account_settings" className="relative mb-10">
      <AccountNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="ml-[25rem] w-[55%]">
        {activeTab === 0 && <Welcome setActiveTab={setActiveTab} />}
        {activeTab === 1 && <PersonalInfo />}
        {activeTab === 2 && <CompanyInfo />}
      </div>
    </section>
  );
};

export default Profile;
