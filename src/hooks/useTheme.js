import { useStorage } from './useStorage';

export function useTheme() {
  const [lightMode, setLightMode] = useStorage('lm', false);

  const toggle = () => setLightMode((v) => !v);

  return { lightMode, toggle, setLightMode };
}
