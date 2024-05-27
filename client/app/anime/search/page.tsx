'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface AnimeQueryRes {
  "pagination": {} | undefined;
  "data": Anime[] | undefined
}

interface Anime {
  "mal_id": number | undefined;
  "title": string | undefined;
  "image": string | undefined;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q");
  const [animeData, setAnimeData] = useState<AnimeQueryRes>({"pagination": {}, "data": []});
  const BASE_URL:string = "http://localhost:8080/api"
  useEffect(() => {
    if (searchTerm !== null) {
      console.log("gagnatgahaga")
      fetch(`${BASE_URL}/anime/search?q=${searchTerm}`)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 400) {
            console.error("Got a 400")
            return null;
          } else {
            console.error("Got a 500")
            return null;
          }
        })
        .then((searchResults:AnimeQueryRes) => {
          setAnimeData(searchResults);
        })
    }
  }, [searchTerm])
  
  return (
    <div>
      SearchPage
      {animeData && (
        <div>
          {animeData.data?.map((anime:Anime) => (
            <p key={anime.mal_id}>{anime.title}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage
