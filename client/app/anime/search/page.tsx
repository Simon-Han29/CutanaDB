'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, ChangeEvent } from 'react'
import Card from '@/app/components/Card'
import Navbar from '@/app/components/Navbar'
import SearchBar from '@/app/components/SearchBar'
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

interface Genre {
  "mal_id": number | undefined;
  "name": string
}

type SelectedGenres = {
  [key: string]: number | undefined;
}

type GenreResponse = Genre[]

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q");
  const [animeData, setAnimeData] = useState<AnimeQueryRes>({"pagination": {}, "data": []});
  const [isMenuOpen, setIsMenuOpen] = useState<Boolean>(false)
  const [genres, setGenres] = useState<GenreResponse>([]);
  const [loadingGenres, setLoadingGenres] = useState<Boolean>(false)
  const [typeOptions, setTypeOptions] = useState<string[]>(["tv","movie","ova","special", "ona", "music", "cm", "pv", "tv_special"]);
  const [statusOptions, setStatusOptions] = useState<string[]>(["airing", "complete", "upcoming"]);
  const [ratingOptions, setRatingOptions] = useState<string[]>(["g", "pg", "pg13", "r17", "r", "rx"]);
  const [orderOptions, setOrderOptions] = useState<string[]>(["mal_id", "title", "start_date", "end_date", "episodes", "score", "scored_by", "rank", "popularity", "members", "favorites"])
  const [sortOptions, setSortOptions] = useState<string[]>(["desc", "asc"]);

  const [selectedGenres, setSelectedGenres] = useState<SelectedGenres>({})
  const[selectedType, setSelectedType] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedRating, setSelectedRating] = useState<string>("")
  const [selectedOrder, setSelectedOrder] = useState<string>("")
  const [selectedSortOption, setSelectedSortOption] = useState<string>("");

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
  
  function handleOpenMenu() {
    setIsMenuOpen(true)
    if (genres.length === 0) {
      setLoadingGenres(true)
      fetch(`${BASE_URL}/anime/genres`)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((genres:GenreResponse) => {
          console.log(genres)
          setGenres(genres);
          setLoadingGenres(false)
        })
    }
  }

  function handleCloseMenu() {
    setIsMenuOpen(false)
  }

  function handleSelectGenre(event: ChangeEvent<HTMLInputElement>, genre_id:number|undefined, genre_name:string) {
    if (event.target.checked) {
      setSelectedGenres(prevSelectedGenres => ({
        ...prevSelectedGenres,
        [genre_name]: genre_id
      }));
    } else {
      setSelectedGenres(prevSelectedGenres => {
        const newSelectedGenres = { ...prevSelectedGenres };
        delete newSelectedGenres[genre_name];
        return newSelectedGenres;
      });
    }
    console.log(selectedGenres)
  }

  function handleSelectType(type:string) {
    setSelectedType(type)
  }

  function handleSelectStatus(status:string) {
    setSelectedStatus(status)
  }

  function handleSelectRating(rating:string) {
    setSelectedRating(rating)
  }

  function handleSelectOrder(order:string) {
    setSelectedOrder(order)
  }

  function handleSelectSortOption(sortOption:string) {
    setSelectedSortOption(sortOption)
  }

  function handleAdvancedSearch() {
    let queryParams = buildAdvancedSearchQueryString();
    fetch(`${BASE_URL}/anime/advancedSearch?${queryParams}`)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if(response.status === 400) {

        } else {

        }
      })
      .then((searchResults:AnimeQueryRes) => {
        console.log(searchResults);
        setAnimeData(searchResults);
      })

  }

  function buildAdvancedSearchQueryString() {
    let str = ""
    if (Object.values(selectedGenres).length > 0) {
      if (str.length > 0) {
        str += "&"
      }
      str += "genres="
      const numSelectedGenres = Object.values(selectedGenres).length; 
      let genreCount = 0;
      Object.values(selectedGenres).map((value) => {

        if (genreCount === 0 || genreCount === numSelectedGenres) {
          str += value
        }
         else {
          str += `,${value}`
        }
        genreCount+=1;
      })
    }

    if (selectedType.length !== 0) {
      if (str.length > 0) {
        str += "&"
      }
      str += `type=${selectedType}`
    }

    if (selectedStatus.length !== 0) {
      if (str.length > 0) {
        str += "&"
      }
      str += `status=${selectedStatus}`
    }

    if (selectedRating.length !== 0) {
      if (str.length > 0) {
        str += "&"
      }
      str += `rating=${selectedRating}`
    }

    if (selectedOrder.length !== 0) {
      if (str.length > 0) {
        str += "&"
      }
      str += `order_by=${selectedOrder}`
    }

    if (selectedOrder.length !== 0) {
      if (str.length > 0) {
        str += "&"
      }
      str += `sort_by=${selectedSortOption}`
    }

    console.log(str)
    return str
  }

  return (
    <div className="bg-black text-white">
      <Navbar></Navbar>
      <SearchBar/>
      <button className="m-5 border px-5 py-1 hover:bg-red-500 transition ease-in" onClick={handleOpenMenu}>Filters</button>
      {isMenuOpen && (
        <div className="border flex flex-col mx-20 bg-slate-900 rounded-[25px]">
          <button className="self-end mr-5 mt-5" onClick={handleCloseMenu}>Close Menu</button>
          <p className="self-center">Filters</p>
          <div>
            <div>
              <hr className="my-2"/>
              <p className="pl-2">Genres</p>
              <hr className="my-2"/>
              <div className="px-5">
                {loadingGenres ? (
                  <p>loading...</p>
                ): (
                  <div>
                    {genres.length === 0 ? (
                      <div>loading</div>
                    ) : (
                      <div className="flex flex-wrap">
                        {genres.map((genre) => (
                          <div key={genre.mal_id} className="border rounded-[20px] p-2 m-1">
                            <label className="inline-flex items-center">
                              <input type="checkbox" 
                              className="hidden peer"
                              onChange={(event) => handleSelectGenre(event, genre.mal_id, genre.name)}
                              checked={!!selectedGenres[genre.name]}
                              />
                              <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded-full peer-checked:bg-red-500 peer-checked:border-transparent peer-focus:ring-2 peer-focus:ring-blue-500"></div>
                              <span className="ml-2 text-white">{genre.name}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <hr className="mt-5"/>
              <p className="pl-2 pt-5">Type</p>
              <hr className="my-2"/>
              <div className="flex flex-wrap px-5">
                {typeOptions.map((type) => (
                  <div key={type} className="border rounded-[20px] p-2 m-1">
                    <label className="inline-flex items-center">
                      <input className="hidden peer" type="radio" name="type" checked={selectedType===type} onChange={() => handleSelectType(type)}/>
                      <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded-full peer-checked:bg-red-500 peer-checked:border-transparent peer-focus:ring-2 peer-focus:ring-blue-500"></div>
                      <span className="ml-2 text-white">{type}</span>
                    </label>

                  </div>                
                ))}
              </div>
            </div>

            <div>
              <hr className="mt-5"/>
              <p className="pl-2 pt-5">Status</p>
              <hr className="my-2"/>
              <div className="flex flex-wrap px-5">
                {statusOptions.map((status) => (
                  <div key={status} className="border rounded-[20px] p-2 m-1">
                    <label className="inline-flex items-center">
                      <input className="hidden peer" type="radio" name="status" checked={selectedStatus===status} onChange={() => handleSelectStatus(status)}/>
                      <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded-full peer-checked:bg-red-500 peer-checked:border-transparent peer-focus:ring-2 peer-focus:ring-blue-500"></div>
                      <label htmlFor="status">{status}</label>
                    </label>
                  </div>                
                ))}
              </div>
            </div>

            <div>
              <hr className="mt-5"/>
              <p className="pl-2 pt-5">Rating</p>
              <hr className="my-2"/>
              <div className="flex flex-wrap px-5">
                {ratingOptions.map((rating) => (
                  <div key={rating} className="border rounded-[20px] p-2 m-1">
                    <label className="inline-flex items-center">
                      <input className="hidden peer" type="radio" name="rating" checked={selectedRating===rating} onChange={() => handleSelectRating(rating)}/>
                      <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded-full peer-checked:bg-red-500 peer-checked:border-transparent peer-focus:ring-2 peer-focus:ring-blue-500"></div>
                      <span>{rating}</span>
                    </label>
                  </div>                
                ))}
              </div>
            </div>

            <div>
              <hr className="mt-5"/>
              <p className="pl-2 pt-5">Order</p>
              <hr className="my-2"/>
              <div className="flex flex-wrap px-5">
                {orderOptions.map((order) => (
                  <div key={order} className="border rounded-[20px] p-2 m-1">
                    <label className="inline-flex items-center">
                      <input className="hidden peer" type="radio" name="order" checked={selectedOrder===order} onChange={() => handleSelectOrder(order)}/>
                      <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded-full peer-checked:bg-red-500 peer-checked:border-transparent peer-focus:ring-2 peer-focus:ring-blue-500"></div>
                      <span>{order}</span>
                    </label>
                  </div>                
                ))}
              </div>
            </div>

            <div>
              <hr className="mt-5"/>
              <p className="pl-2 pt-5">Sort</p>
              <hr className="my-2"/>
              <div className="flex flex-wrap px-5">
                {sortOptions.map((sortOption) => (
                  <div key={sortOption} className="border rounded-[20px] p-2 m-1">
                    <label className="inline-flex items-center">
                      <input className="hidden peer" type="radio" name="sort" checked={selectedSortOption===sortOption} onChange={() => handleSelectSortOption(sortOption)}/>
                      <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded-full peer-checked:bg-red-500 peer-checked:border-transparent peer-focus:ring-2 peer-focus:ring-blue-500"></div>
                      <label htmlFor="sort">{sortOption}</label>
                    </label>
                  </div>                
                ))}
              </div>
            </div>

          </div>
          <hr className="mt-5"/>
          <div className="flex justify-center">
            <button className="h-[50px] w-32 bg-red-500 rounded-[20px]" onClick={handleAdvancedSearch}>Show Results</button>
          </div>
        </div>
      )}

    {animeData && (
        <div className="flex flex-wrap">
          {animeData.data?.map((anime:Anime) => (
            // <p key={anime.mal_id}>{anime.title}</p>
            <Card key={anime.mal_id} mal_id={anime.mal_id} title={anime.title} image={anime.images.webp.image_url}></Card>
          ))}
        </div>
      )}
    </div>
    
  )
}

export default SearchPage
