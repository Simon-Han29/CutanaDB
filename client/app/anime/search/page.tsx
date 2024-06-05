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
      <button onClick={handleOpenMenu}>Filters</button>
      {isMenuOpen && (
        <div className='border'>
          <button className="" onClick={handleCloseMenu}>Close Menu</button>
          <p>Filters</p>
          <div>
            <div>
              <p>Genres</p>
              <hr />
              <div>
                {loadingGenres ? (
                  <p>loading...</p>
                ): (
                  <div>
                    {genres.length === 0 ? (
                      <div>loading</div>
                    ) : (
                      <div className="flex flex-wrap">
                        {genres.map((genre) => (
                          <div key={genre.mal_id} className="border">
                            <input
                              type="checkbox"
                              name="genre"
                              className="circular-checkbox"
                              onChange={(event) => handleSelectGenre(event, genre.mal_id, genre.name)}
                              checked={!!selectedGenres[genre.name]} // Convert to boolean
                            />
                            <label htmlFor="genre">{genre.name}</label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p>Type</p>
              <hr />
              <div className="flex">
                {typeOptions.map((type) => (
                  <div key={type} className="border">
                    <input type="radio" name="type" checked={selectedType===type} onChange={() => handleSelectType(type)}/>
                    <label htmlFor="type">{type}</label>
                  </div>                
                ))}
              </div>
            </div>

            <div>
              <p>Status</p>
              <hr />
              <div className="flex">
                {statusOptions.map((status) => (
                  <div key={status} className="border">
                    <input type="radio" name="status" checked={selectedStatus===status} onChange={() => handleSelectStatus(status)}/>
                    <label htmlFor="status">{status}</label>
                  </div>                
                ))}
              </div>
            </div>

            <div>
              <p>Rating</p>
              <hr />
              <div className="flex">
                {ratingOptions.map((rating) => (
                  <div key={rating} className="border">
                    <input type="radio" name="rating" checked={selectedRating===rating} onChange={() => handleSelectRating(rating)}/>
                    <label htmlFor="rating">{rating}</label>
                  </div>                
                ))}
              </div>
            </div>

            <div>
              <p>Order</p>
              <hr />
              <div className="flex">
                {orderOptions.map((order) => (
                  <div key={order} className="border">
                    <input type="radio" name="order" checked={selectedOrder===order} onChange={() => handleSelectOrder(order)}/>
                    <label htmlFor="order">{order}</label>
                  </div>                
                ))}
              </div>
            </div>

            <div>
              <p>Sort</p>
              <hr />
              <div className="flex">
                {sortOptions.map((sortOption) => (
                  <div key={sortOption} className="border">
                    <input type="radio" name="sort" checked={selectedSortOption===sortOption} onChange={() => handleSelectSortOption(sortOption)}/>
                    <label htmlFor="sort">{sortOption}</label>
                  </div>                
                ))}
              </div>
            </div>

          </div>
          <button onClick={handleAdvancedSearch}>Show Results</button>
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
