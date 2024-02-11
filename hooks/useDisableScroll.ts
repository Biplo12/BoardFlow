import { useEffect } from 'react';

const useDisableScroll = () => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden', 'overscroll-none');
    return () => {
      document.body.classList.remove('overflow-hidden', 'overscroll-none');
    };
  }, []);
};

export default useDisableScroll;
