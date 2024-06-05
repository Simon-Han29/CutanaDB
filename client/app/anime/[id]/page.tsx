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
    <div>
      <Navbar />
      <SearchBar />
      <div>
        {animeData?.images?.webp?.image_url ? (
          <Image src={animeData.images.webp.image_url} alt={animeData.title || 'Anime Image'} width={500} height={750} />
        ) : (
          <p>No image available</p>
        )}
        <p>{animeData?.title}</p>
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
          <div>
            <button onClick={handleRemoveFromList}>Remove From List</button>
          </div>
        ) : (
          <div>
            <button onClick={handleAddToList}>Add To List</button>
          </div>
        )}
        <div>
          <p>{animeData?.type}</p>
          <p>{animeData?.episodes}</p>
          <p>{animeData?.status}</p>
          <p>{animeData?.duration}</p>
          <p>{animeData?.rating}</p>
          <p>{animeData?.rank}</p>
          <p>{animeData?.score}</p>
          <p>{animeData?.type}</p>
          <p>{animeData?.season}</p>
          <p>{animeData?.type}</p>
          <p>{animeData?.year}</p>
          {animeData?.genres.map((genre) => (
            <div key={genre.mal_id}>
              <p>{genre.name}</p>
            </div>
          ))}
          {loadingCharacterData ? (
            <p>Loading characters...</p>
          ): (
            <div>
              {characterData && (
                <div>
                  <div>
                    {characterData.map((character) => (
                      <div key={character.character.name}>
                        {character.character.images.webp.image_url ? (
                          <div>
                            <Image src={character.character.images.webp.image_url} alt={character.character.name || 'Anime Image'} width={200} height={400} />
                            <p>{character.character.name}</p>
                          </div>
                          
                          
                        ) : (
                          <p>No image available</p>
                        )}
                      </div>
                    ))}
                  </div>
                  {characterData.map((character) => (
                    <p key={character.character.name}>{character.character.name}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleAnimePage;
