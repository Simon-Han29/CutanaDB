import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const SearchBar = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const search = (event: any) => {
    if (event.key === 'Enter' && isClient) {
      const searchterm = event.target.value;
      router.push(`/anime/search?q=${searchterm}`);
    } else {
      console.log(event.target.value);
    }
  }

  return (
    <div className="mx-20 flex justify-end">
      <input className="rounded-[20px] px-5 py-2 outline-none" type="text" placeholder='Search Anime Title' onKeyDown={search} />
    </div>
  )
}

export default SearchBar
