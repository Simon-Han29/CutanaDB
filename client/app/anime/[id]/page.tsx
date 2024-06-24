'use client'

import Navbar from '@/app/components/Navbar';
import SearchBar from '@/app/components/SearchBar';
import React, { useEffect, useState } from 'react';
import Image from "next/image";

interface SingleAnimeQueryRes {
  pagination: {} | undefined;
  data: Anime | undefined;
}

interface Anime {
  mal_id: number | undefined;
  title: string | undefined;
  titles: Title[];
  type: string;
  episodes: string;
  status: string;
  duration: string;
  rating: string;
  score: number;
  rank: number;
  images: Images;
  synopsis: string;
  season: string;
  year: number;
  genres: Genre[];
}

interface Title {
  type: string;
  title: string;
}
interface Images {
  webp: ImageFormat;
  jpg: ImageFormat;
}

interface ImageFormat {
  image_url: string;
}

interface Genre {
  mal_id: string;
  type: string;
  name: string;
}

interface CharacterData {
  character: Character;
  role: string;
}

interface Character {
  mal_id: string;
  images: Images;
  name: string;
}

const SingleAnimePage = ({ params }: { params: { id: number } }) => {
  const BASE_URL: string = "http://localhost:8080/api";
  const mal_id = params.id;
  const [animeData, setAnimeData] = useState<Anime | undefined>(undefined);
  const [isInList, setIsInList] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const [characterData ,setCharacterData] = useState<CharacterData[]>([])
  const [loadingCharacterData, setLoadingCharacterData] = useState<Boolean>(true);
  useEffect(() => {
    fetch(`${BASE_URL}/anime/${mal_id}`)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          console.error("Got a 400");
          return null;
        } else {
          console.error("Got a 500");
          return null;
        }
      })
      .then((queryResult: SingleAnimeQueryRes) => {
        setAnimeData(queryResult?.data);
        setLoading(false);
      });
  }, [mal_id]);

  useEffect(() => {
    fetch(`${BASE_URL}/account/animelist/${mal_id}`, { credentials: 'include' })
      .then((response) => {
        if (response.status === 200) {
          setIsInList(true);
        } else if (response.status === 404) {
          setIsInList(false);
        }
      });
  }, [mal_id]);

  useEffect(() => {
    setTimeout(fetchCharacterData, 3000)
  }, [])

function fetchCharacterData() {
  fetch(`${BASE_URL}/anime/${mal_id}/characters`)
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 400) {
      console.error("Got a 400");
      return null;
    } else {
      console.error("Got a 500");
      return null;
    }
  })
  .then((queryResult: CharacterData[]) => {
    setCharacterData(queryResult);
    setLoadingCharacterData(false);
  });
}

  function handleAddToList() {
    fetch(`${BASE_URL}/account/animelist`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mal_id: mal_id,
        title: animeData?.title,
        image_url: animeData?.images?.webp?.image_url
      })
    })
      .then((response) => {
        if (response.status === 201) {
          setIsInList(true);
        }
      });
  }

  function handleRemoveFromList() {
    fetch(`${BASE_URL}/account/animelist/${mal_id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mal_id: mal_id
      })
    })
      .then((response) => {
        if (response.status === 200) {
          setIsInList(false);
        }
      });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-black text-white'>
      <Navbar />
      <SearchBar />
      <div className="flex justify-center">
        <div className="flex flex-col items-center w-[90%]">
          <div className='flex flex-col items-center'>
            {animeData?.images?.webp?.image_url ? (
              <Image src={animeData.images.webp.image_url} alt={animeData.title || 'Anime Image'} width={200} height={400} />
            ) : (
              <p>No image available</p>
            )}
            <h1>{animeData?.title}</h1>
            {animeData?.titles.map((titleObj) => (
              <div key={titleObj.type}>
                {titleObj.type === "Japanese" ? (
                  <p>{titleObj.title}</p>
                ) : (
                  <></>
                )}
              </div>
            ))}
            {isInList ? (
              <div className=''>
                <button onClick={handleRemoveFromList}>Remove From List</button>
              </div>
            ) : (
              <div>
                <button className="border h-[50px] w-[200px] bg-red-600" onClick={handleAddToList}>Add To List</button>
              </div>
            )}
            <div>
              <p className='text-center'>Title: {animeData?.type}</p>
              <p className='text-center'>Episodes: {animeData?.episodes}</p>
              <p className='text-center'>Status: {animeData?.status}</p>
              <p className='text-center'>Duration: {animeData?.duration}</p>
              <p className='text-center'>Rating: {animeData?.rating}</p>
              <p className='text-center'>Rank: {animeData?.rank}</p>
              <p className='text-center'>Score: {animeData?.score}/10</p>
              <p className='text-center'>Type: {animeData?.type}</p>
              <p className='text-center'>Season: {animeData?.season}</p>
              <p className='text-center'>Type: {animeData?.type}</p>
              <p className='text-center'>Year:{animeData?.year}</p>
              <div className='flex flex-row'>
                Genres: 
                {animeData?.genres.map((genre) => (
                  <div key={genre.mal_id}>
                    <p className='text-center'>{genre.name},</p>
                  </div>
                ))}
              </div>

              <p>Synopsis</p>
              <p className="text-start">{animeData?.synopsis}</p>
              <hr />

              <p>Characters</p>
              <hr />
              {loadingCharacterData ? (
                <p>Loading characters...</p>
              ): (
                <div>
                  {characterData && (
                    <div>
                      <div className="flex flex-wrap">
                        {characterData.map((character) => (
                          <div key={character.character.name} className="m-2">
                            {character.character.images.webp.image_url ? (
                              <div>
                                <Image src={character.character.images.webp.image_url} alt={character.character.name || 'Anime Image'} width={200} height={400} />
                                <p className='text-center'>{character.character.name}</p>
                              </div>
                              
                              
                            ) : (
                              <p>No image available</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleAnimePage;
