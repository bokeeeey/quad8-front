import { RefObject, useEffect } from 'react';

export const useOutsideClick = (ref: RefObject<HTMLElement>, callback: (e?: MouseEvent) => void) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const { target } = e;

      if (ref.current && !ref.current.contains(target as Node)) {
        callback(e);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [ref, callback]);
};
