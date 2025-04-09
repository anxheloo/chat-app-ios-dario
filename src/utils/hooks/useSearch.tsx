import {useCallback, useEffect, useRef, useState} from 'react';

const useSearch = () => {
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebounceSearch] = useState<string>('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSearch = useCallback(() => setSearch(''), []);

  const updateSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setDebounceSearch(searchTerm);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {search, debouncedSearch, clearSearch, updateSearch};
};

export default useSearch;
