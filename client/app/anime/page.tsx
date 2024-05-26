'use client'

import React, { useEffect, useState } from 'react'
import Select, { SingleValue, MultiValue, ActionMeta } from 'react-select';


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

interface SeasonalAnimeQueryRes {
  "pagination": {} | undefined;
  "data": Anime[] | undefined
}

interface Anime {
  "mal_id": number | undefined;
  "title": string | undefined;
  "image": string | undefined;
}
function AnimePage() {
  const [seasonalAnimeData, setSeasonalAnimeData] = useState<SeasonalAnimeQueryRes>({"pagination":{}, "data": []});
  const [seasons, setSeasons] = useState<SeasonOption[]>([]);
  const [initialLoad, setInitialLoad] = useState<Boolean>(true);
  const [selectedSeason, setSelectedSeason] = useState<SeasonOption>({"label": "", "value": {"year": 0, "season": ""}})
  let BASE_URL:string = "http://localhost:8080/api"

  useEffect(() => {
    fetchSeasons();
  },[])

  useEffect(() => {
    setTimeout(fetchSeasonalAnime, 3000)
  },[])

  useEffect(() => {
    console.log("rerender")
    if (!initialLoad) {
      fetchAnimeFromSeason(selectedSeason.value?.year,selectedSeason.value?.season)
    }
  }, [selectedSeason])

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
      .then((seasonalAnimeData:SeasonalAnimeQueryRes) => { 
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
      .then((seasonalAnimeData:SeasonalAnimeQueryRes) => {
        setSeasonalAnimeData(seasonalAnimeData);
      })
  }

  return (
    <div>
      {seasons && (
        <Select instanceId="seasonOptions" options={seasons} defaultValue={seasons[0]} onChange={handleSeasonChange}/>
      )}

      {seasonalAnimeData && (
        <div>
          {seasonalAnimeData.data !== undefined && seasonalAnimeData.data.map((anime) => (
            <p key={anime.mal_id}>{anime.title}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default AnimePage
