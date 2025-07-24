import { useEffect } from 'react';

const useTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Micro Task Platform`;
    } else {
      document.title = 'Micro Task Platform';
    }
  }, [title]);
};

export default useTitle;
