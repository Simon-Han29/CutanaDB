'use client'

import React, { useEffect, useState } from 'react'
import Select, { SingleValue, MultiValue, ActionMeta } from 'react-select';
interface SingleAnime {
  "mal_id": number,
  "title": string
}
interface AnimeData {
  "pagination": Object,
  "data": SingleAnime[],
}

interface Option {
  value: string;
  label:string;
}

interface Season {
  year: number;
  season: string
}

interface SeasonOption {
  label: string;
  value: Season
}

interface SeasonalYear {
  year:number,
  seasons: string[]
}

interface SeasonsData {
  "pagination": Object,
  "data": SeasonalYear[]
}

const categoryOptions = [
  {value: "Seasonal", label: "Seasonal"},
  {value: "Top", label: "Top"}
]

const defaultCategory = {value: "Seasonal", label:"Seasonal"}
function AnimePage() {
  const [animeData, setAnimeData] = useState<AnimeData>({pagination: {}, data: []})
  const [category, setCategory] = useState<string>("Seasonal")
  const [season, setSeason] = useState<string>("")
  const [seasonList, setSeasonList] = useState<SeasonOption[]>([])
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
      .then((animeData:AnimeData) => {
        console.log(animeData);
        setAnimeData(animeData);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/anime/seasons`)
      .then((res) => {
        if (res.status === 200) {
          if (res !== undefined) {
            return res.json();
          }
        } else if (res.status === 400) {
          throw new Error("Bad Request")
        } else {
          throw new Error("Internal server error")
        }
      })
      .then((seasonsData:SeasonsData) => {
        if (seasonsData !==undefined) {
          let seasons:SeasonOption[] = []
          seasonsData.data.map((seasonalYear:SeasonalYear) => {
            seasonalYear.seasons.map((season) => {
              seasons.push({label: `${season}${seasonalYear.year}`, value: {year:seasonalYear.year, season:season}})
            })
          })
          setSeason(seasons[0].label);
          setSeasonList(seasons);
        } else {
          throw new Error("seasonsData was undefined")
        }

      })
      .catch((err) => {
        console.log("made it in error")
      })
  }, [])

  useEffect(() => {

  }, [seasonList])

  function handleChangeCategory(selectedOption: SingleValue<Option>) {
    if (selectedOption !== null) {
      setCategory(selectedOption.value)
    } 
  }

  function handleChangeSeason(selectedOption: SingleValue<SeasonOption>) {
    if (selectedOption !== null) {
      setSeason(selectedOption.label)
      console.log(selectedOption.value);
    }
  }
  return (
    <div>
      <label htmlFor="selectCategory"></label>
      <Select instanceId="categoryOptions" options={categoryOptions} defaultValue={defaultCategory} onChange={handleChangeCategory}/>
      {seasonList.length > 0 && (
        <Select instanceId="seasonOptions" options={seasonList} defaultValue={seasonList[0]} onChange={handleChangeSeason}></Select>
      )}
      {animeData && (
        <div>
          <h1>Anime for this seasons</h1>
          {animeData.data.map((anime) => (
            <div key={anime.mal_id}>{anime.title}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AnimePage
