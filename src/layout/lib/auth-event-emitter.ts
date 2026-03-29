type Listener = () => void;
const listeners: Listener[] = [];
const loginListeners: Listener[] = [];

export const logOut = () => {
  listeners.forEach((listener) => listener());
};

export const onLogOut = (listener: Listener) => {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);

    if (index > -1) listeners.splice(index, 1);
  };
};

export const openLogin = () => {
  loginListeners.forEach((listener) => listener());
};

export const onOpenLogin = (listener: Listener) => {
  loginListeners.push(listener);

  return () => {
    const index = loginListeners.indexOf(listener);

    if (index > -1) loginListeners.splice(index, 1);
  };
};
