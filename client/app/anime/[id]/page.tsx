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
  "images": Images;
}

interface Images {
  "webp": ImageFormat,
  "jpg": ImageFormat
}

interface ImageFormat {
  "image_url": string
}

const SingleAnimePage = ({params}:{params: {id:number}}) => {
  const BASE_URL:string = "http://localhost:8080/api"
  const mal_id = params.id;
  const [animeData, setAnimeData] = useState<Anime|undefined>({
    "mal_id": -4, 
    "title": "", 
    "images": {
      "webp": {"image_url": ""}, 
      "jpg": {"image_url": ""}
    }
  })
  const [isInList, setIsInList] = useState<Boolean>(false)
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

  useEffect(() => {
    fetch(`${BASE_URL}/account/animelist/${mal_id}`, {credentials: 'include'})
      .then((response) => {
        if(response.status === 200) { 
          setIsInList(true)
        } else if (response.status === 404) {
          setIsInList(false)
        }
      })
  })

  function handleAddToList() {
    fetch(`${BASE_URL}/account/animelist`, {
      "method": "POST",
      "credentials": "include",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "mal_id": mal_id,
        "title": animeData?.title,
        "image_url": animeData?.images.webp.image_url
      })
    })
    .then((response) => {
      if (response.status === 201) {
        setIsInList(true);
      }
    })
  }

  function handleRemoveFromList() {
    fetch(`${BASE_URL}/account/animelist/${mal_id}`, {
      "method": "DELETE",
      "credentials": "include",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "mal_id": mal_id
      })
    })
    .then((response) => {
      if (response.status === 200) {
        setIsInList(false);
      }
    })
  }

  return (

    <div>
      <SearchBar/>
      <Navbar/>
      <div>
        <p>{animeData?.title}</p>
        {isInList ? (
          <div>
            <button onClick={handleRemoveFromList}>Remove From List</button>
          </div>
        ) : (
          <div>
            <button onClick={handleAddToList}>Add To List</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleAnimePage;
