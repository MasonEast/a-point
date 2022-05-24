declare global {
  interface Window {
    A_POINT: string;
  }
  type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T;
    currentTarget: T;
  };
}

export {};
