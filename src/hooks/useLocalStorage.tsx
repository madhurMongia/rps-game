import { useEffect, useState } from 'react';

type StorageValue = string | number | boolean | null | undefined | bigint;

export function useLocalStorage(
  initialKey: string,
  initialValue: StorageValue
): [string, StorageValue, (key: string, value: StorageValue) => void] {
  const [key, setKey] = useState(initialKey);
  const [value, setValue] = useState<StorageValue>(() => {
    const itemStr = window.localStorage.getItem(key);
    if (itemStr !== null) {
      if (typeof initialValue === 'bigint') {
        return BigInt(itemStr);
      } else {
        return JSON.parse(itemStr);
      }
    }
    return initialValue;
  });

  const setKeyAndValue = (newKey: string, newValue: StorageValue) => {
    setKey(newKey);
    setValue(newValue);
    if (typeof newValue === 'bigint') {
      window.localStorage.setItem(newKey, newValue.toString());
    } else {
      window.localStorage.setItem(newKey, JSON.stringify(newValue));
    }
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== value?.toString()) {
        const newValue =
          typeof initialValue === 'bigint'
            ? BigInt(event.newValue || '0')
            : event.newValue
            ? JSON.parse(event.newValue)
            : initialValue;
        setValue(newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, value, initialValue]);

  return [key, value, setKeyAndValue];
}