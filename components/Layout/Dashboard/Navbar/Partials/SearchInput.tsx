import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

const SearchInput: React.FC = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const [debouncedValue] = useDebounceValue(searchValue, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: '/dashboard',
        query: {
          search: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className='relative hidden w-full flex-1 lg:flex'>
      <Search
        className='pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2'
        style={{ color: 'var(--candy-muted)' }}
      />
      <input
        className='candy-field has-icon w-full max-w-[480px]'
        placeholder='Search boards'
        onChange={handleChange}
        value={searchValue}
      />
    </div>
  );
};
export default SearchInput;
