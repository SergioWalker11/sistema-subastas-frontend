import { useEffect } from 'react';

export function useTeclaEscape(onEscape) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onEscape();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onEscape]);
}

export function useClickFuera(ref, onClickFuera) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClickFuera();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClickFuera]);
}
