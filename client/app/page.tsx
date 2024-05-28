'use client';

import { useEffect, useState } from "react";
import  Link  from "next/link";
import Navbar from "./components/Navbar"
import SearchBar from "./components/SearchBar";
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
    <div>
      <SearchBar/>
      <Navbar />
      <div>
        <h1>Cutana</h1>
        <p>A Database for Anime and Manga</p>
      </div>
      {seasonalAnimeData && (
        <div>
          <h1>Anime for this seasons</h1>
          {seasonalAnimeData.data.map((anime) => (
            <div key={anime.mal_id}>{anime.title}</div>
          ))}
        </div>
      )}

      {topMangaData && (
        <div>
          <h1>Top Manga</h1>
          {topMangaData.data.map((manga) => (
            <div key={manga.mal_id}>{manga.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;