'use client';

import { useEffect } from "react";
import  Link  from "next/link";

type SeasonalAnime = Object[];

function Home() {
  useEffect(() => {
    fetch("http://localhost:8080/api/anime/seasonal/now")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((seasonalRes:SeasonalAnime) => {
        console.log(seasonalRes);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
    <div>
      Home
      <Link href="/anime">Go to AnimePage</Link>
    </div>
  );
}
  
export default Home;