import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import { Input } from '@/components/ui/input';

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
        url: '/',
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
      <Search className='text-muted-foreground m absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform' />
      <Input
        className='w-full max-w-[500px] pl-9'
        placeholder='Search boards'
        onChange={handleChange}
        value={searchValue}
      />
    </div>
  );
};
export default SearchInput;
