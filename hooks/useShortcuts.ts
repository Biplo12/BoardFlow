import { useEffect } from 'react';

import { useHistory } from '@/liveblocks.config';

const useShortcuts = (deleteLayers: () => void) => {
  const history = useHistory();
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'z': {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [deleteLayers, history]);

  return null;
};

export default useShortcuts;
