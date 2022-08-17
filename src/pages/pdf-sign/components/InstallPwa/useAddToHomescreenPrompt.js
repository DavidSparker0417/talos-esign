import React, { createContext, useEffect, useContext, useCallback } from 'react';

const PromptToInstall = createContext({deferredEvt: null});

export function PromptToInstallProvider(props) {
  const [deferredEvt, setDeferredEvt] = React.useState(
    null,
  );

  const hidePrompt = useCallback(() => {
    setDeferredEvt(null);
  }, []);

  useEffect(() => {
    const ready = (e) => {
      e.preventDefault();
      setDeferredEvt(e);
    };

    window.addEventListener('beforeinstallprompt', ready);

    return () => {
      window.removeEventListener('beforeinstallprompt', ready);
    };
  }, []);

  return (
    <PromptToInstall.Provider value={{deferredEvt, hidePrompt}}>
      {props.children}
    </PromptToInstall.Provider>
  );
}

export default function usePromptToInstall() {
  const ctx = useContext(PromptToInstall);
  if (!ctx) {
    throw new Error('Cannot use usePromptToInstall() outside <PromptToInstallProvider />');
  }
  return ctx;
}