import { Toaster } from 'react-hot-toast';

const ToasterProvider = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          zIndex: 40,
        },
      }}
    />
  );
};
export default ToasterProvider;
