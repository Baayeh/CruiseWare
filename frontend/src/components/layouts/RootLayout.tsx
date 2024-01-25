import { Outlet } from 'react-router-dom';
import { ToasterProvider } from '../../libs';

const RootLayout = () => {
  return (
    <>
      <Outlet />
      <ToasterProvider />
    </>
  );
};

export default RootLayout;
