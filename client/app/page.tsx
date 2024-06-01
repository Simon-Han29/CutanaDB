'use client';

import { useEffect, useState } from "react";
import  Link  from "next/link";
import Navbar from "./components/Navbar"
import SearchBar from "./components/SearchBar";
import { Festive } from "next/font/google";
interface SingleAnime {
  "mal_id": number,
  "title": string
}
interface SeasonalAnime {
  "pagination": Object,
  "data": SingleAnime[],
}

interface SingleManga {
  "mal_id": number,
  "title": string
}
interface TopManga {
  "pagination": Object,
  "data": SingleManga[],
}
function Home() {
  let [seasonalAnimeData, setSeasonalAnimeData] = useState<SeasonalAnime>({pagination:{}, data:[]})
  let [topMangaData, setTopMangaData] = useState<TopManga>({pagination:{}, data:[]})
  let BASE_URL:string = "http://localhost:8080/api"

  useEffect(() => {
    fetch(`${BASE_URL}/anime/seasonal/now`)
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          return data;
        } else if (res.status === 400) {
          throw new Error("Bad Request")
        } else {
          throw new Error("Internal server error")
        }
      })
      .then((seasonalRes:SeasonalAnime) => {
        setSeasonalAnimeData(seasonalRes);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/manga/top`)
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          return data;
        } else if (res.status === 400) {
          throw new Error("Bad Request")
        } else {
          throw new Error("Internal server error")
        }
      })
      .then((topMangaRes:TopManga) => {
        setTopMangaData(topMangaRes);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, [])

  return (
    <div className="snap-y overflow-y-scroll snap-mandatory h-screen">
      <div className="bg-black text-white h-screen snap-start">
        <div>
          <Navbar/>
        </div>
        <div className="
          flex flex-col 
          justify-center 
          items-center 
          mt-40 
          mx-28 
          h-[70%] 
          bg-gradient-to-b 
          from-red-950 from-30% 
          to-black to-100%
          rounded-[20px]
          shadow-md
        ">
          <h1 className="text-[128px] font-extrabold fon-arial">Cutana</h1>
          <p>A Database for Anime and Manga</p>
        </div>
        <div className="flex justify-center">
          <p>Powered by Jikan API</p>
        </div>
      </div>
      <div className="h-screen snap-start bg-black py-10 px-28 flex justify-center items-center">
        <div className="
          text-white
          flex
          flex-col
          justify-center
          items-center
          
          h-[90%]
          w-[90%]
          bg-gradient-to-b
          from-black from-10%
          via-red-950 via-30%
          to-black to-100%
        ">
          <p>Browse Your Favorite Anime</p>
          <div>
            {seasonalAnimeData && (
              <div>
                {seasonalAnimeData.data.map((anime) => (
                  <div key={anime.mal_id}>
                    <p>{anime.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-screen snap-start bg-black py-10 px-28 flex justify-center items-center">
        <div className="
          h-[90%] 
          w-[90%]
          bg-gradient-to-b 
          from-black from-30%
          to-red-950 to 100%
          rounded-[20px]
          flex
          flex-col
          justify-center
          items-center
        ">
          <p className="text-white">Browse the top Manga</p>
        </div>
      </div>
    </div>
  );
}

export default Home;