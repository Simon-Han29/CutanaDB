'use client'

import Navbar from '@/app/components/Navbar';
import SearchBar from '@/app/components/SearchBar';
import React, { useEffect, useState } from 'react'

interface SingleAnimeQueryRes {
  "pagination": {} | undefined;
  "data": Anime | undefined
}

interface Anime {
  "mal_id": number | undefined;
  "title": string | undefined;
  "image": string | undefined;
}

const SingleAnimePage = ({params}:{params: {id:number}}) => {
  const BASE_URL:string = "http://localhost:8080/api"
  const mal_id = params.id;
  const [animeData, setAnimeData] = useState<Anime|undefined>({"mal_id": -4, "title": "", "image": ""})
  useEffect(() => {
    fetch(`${BASE_URL}/anime/${mal_id}`)
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
      .then((queryResult:SingleAnimeQueryRes) => {
        setAnimeData(queryResult.data)
      })
  }, [])

  return (

    <div>
      <SearchBar/>
      <Navbar/>
      <div>
        <p>{animeData?.title}</p>
        <button>Add To List</button>
      </div>
    </div>
  )
}

export default SingleAnimePage;
