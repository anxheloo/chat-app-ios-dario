import {useCallback, useState} from 'react';

const useSearch = () => {
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebounceSearch] = useState<string>('');

  const clearSearch = useCallback(() => setSearch(''), []);

  const updateSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm);

    const t = setTimeout(() => {
      setDebounceSearch(searchTerm);
    }, 300);

    return () => clearTimeout(t);
  }, []);

  return {search, debouncedSearch, clearSearch, updateSearch};
};

export default useSearch;
