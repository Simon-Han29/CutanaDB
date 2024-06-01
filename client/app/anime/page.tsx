'use client'

import React, { useEffect, useState } from 'react'
import Select, { SingleValue, MultiValue, ActionMeta } from 'react-select';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Link from 'next/link'
import Card from '../components/Card';
interface SeasonInfo {
  "year": number | undefined;
  "season": string | undefined;
}

interface SeasonOption {
  "label": string | undefined;
  "value": SeasonInfo | undefined;
}

interface SeasonalYear {
  "year": number | undefined;
  "seasons": string[] | undefined
}

interface SeasonQueryRes {
  "pagination": {} | undefined;
  "data": SeasonalYear[] | undefined
}

interface AnimeQueryRes {
  "pagination": {} | undefined;
  "data": Anime[] | undefined
}

interface Anime {
  "mal_id": number | undefined;
  "title": string | undefined;
  "images": Images;
}

interface Images {
  "webp": ImageType,
  "jpg": ImageType
}

interface ImageType {
  "image_url": string
}
const categoryOptions = [
  {"value": "Seasonal", "label": "Seasonal"},
  {"value": "Top", "label": "Top"}
]
function AnimePage() {
  const [seasonalAnimeData, setSeasonalAnimeData] = useState<AnimeQueryRes>({"pagination":{}, "data": []});
  const [topAnimeData, setTopAnimeData] = useState<AnimeQueryRes>({"pagination":{}, "data": []})
  const [seasons, setSeasons] = useState<SeasonOption[]>([]);
  const [initialLoad, setInitialLoad] = useState<Boolean>(true);
  const [selectedSeason, setSelectedSeason] = useState<SeasonOption>({"label": "", "value": {"year": 0, "season": ""}})
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>("Seasonal")
  const BASE_URL:string = "http://localhost:8080/api"

  useEffect(() => {
    console.log(selectedCategory);
    fetchSeasons();
  },[])

  useEffect(() => {
    setTimeout(fetchSeasonalAnime, 3000)
  },[])

  useEffect(() => {
    if (!initialLoad) {
      fetchAnimeFromSeason(selectedSeason.value?.year,selectedSeason.value?.season)
    }
  }, [selectedSeason])

  useEffect(() => {
    console.log(selectedCategory)
    if (!initialLoad) {
      if(selectedCategory === "Seasonal") {
        if (seasonalAnimeData.data?.length === 0) {
          setTimeout(fetchSeasonalAnime, 2000)
        }        
      } else if (selectedCategory === "Top") {
        if (topAnimeData.data?.length === 0) {
          setTimeout(fetchTopAnime, 2000)
        }
        
      }
    }
  }, [selectedCategory])

  function fetchSeasons() {
    fetch(`${BASE_URL}/anime/seasons`)
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
      .then((seasonsData:SeasonQueryRes) => { 
        console.log(seasonsData);
        let szns:SeasonOption[] = []
        seasonsData.data?.map((seasonalYear:SeasonalYear) => {
          seasonalYear.seasons?.map((season:string) => {
            szns.push({
              "label": `${season}${seasonalYear.year}`, 
              "value": {
                "year": seasonalYear.year,
                "season":season
              }})
          })
        })
        setSeasons(szns);
        setSelectedSeason(szns[0])
      })
      .catch((err) => console.log(err))
  }

  function fetchSeasonalAnime() {
    fetch(`${BASE_URL}/anime/seasonal/now`)
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
      .then((seasonalAnimeData:AnimeQueryRes) => { 
        setSeasonalAnimeData(seasonalAnimeData);
        setInitialLoad(false);
      })
      .catch((err) => console.log(err))
  }

  function handleSeasonChange(event:SingleValue<SeasonOption>) {

    let sznInfo:SeasonInfo = {
      "season": event?.value?.season,
      "year":event?.value?.year
    }

    let szn:SeasonOption = {
      label: event?.label,
      value: sznInfo
    }
    setSelectedSeason(szn)
    console.log(selectedSeason);
  }

  function fetchAnimeFromSeason(year:number|undefined, season:string|undefined) {
    fetch(`${BASE_URL}/anime/seasonal/${year}/${season}`)
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
      .then((seasonalAnimeData:AnimeQueryRes) => {
        setSeasonalAnimeData(seasonalAnimeData);
      })
  }

  function handleChangeCategory(event:SingleValue<{ value: string | undefined; label: string | undefined; }>) {
      setSelectedCategory(event?.value);
  }

  function fetchTopAnime() {
    fetch(`${BASE_URL}/anime/top`)
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
      .then((topAnimeData:AnimeQueryRes) => {
        setTopAnimeData(topAnimeData)
      })
  }

  return (
    <div className="bg-black h-[100%]">
      <Navbar/>
      <SearchBar/>
      <div className="flex flex-row">
        <div className="flex flex-row">
          <label htmlFor="category" className='text-white'>Category:</label>
          <Select name="category" className="w-[150px]" instanceId="categoryOptions" options={categoryOptions} defaultValue={categoryOptions[0]} onChange={handleChangeCategory}></Select>
        </div>
          {seasons && selectedCategory === "Seasonal" && (
            <div className="flex flex-row">
              <label htmlFor="category" className='text-white'>Season:</label>
              <Select instanceId="seasonOptions" options={seasons} defaultValue={seasons[0]} onChange={handleSeasonChange}/>
            </div>
          )}
        
      </div>
      {seasonalAnimeData && selectedCategory === "Seasonal" && (
        <div className="flex flex-row flex-wrap">
          {seasonalAnimeData.data !== undefined && seasonalAnimeData.data.map((anime) => (
            <Card key={anime.mal_id} mal_id={anime.mal_id} title={anime.title} image={anime.images.webp.image_url}/>
          ))}
        </div>
      )}
      {topAnimeData && selectedCategory === "Top" && (
        <div className="flex flex-row flex-wrap">
          {topAnimeData.data !== undefined && topAnimeData.data.map((anime) => (
            // <p key={anime.mal_id}>{anime.title}</p>
            <Card key={anime.mal_id} mal_id={anime.mal_id} title={anime.title} image={anime.images.webp.image_url}/>
          ))}
        </div>
      )}
    </div>
  )
}

export default AnimePage
