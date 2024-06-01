import React, {useState, useEffect} from 'react'
import Link from "next/link"
const Navbar = () => {
  const BASE_URL:string = "http://localhost:8080/api"
  const[isLoggedIn, setIsLoggedIn] = useState<Boolean>(false)

  useEffect(() => {
    console.log("isLoggedIn:" + isLoggedIn)
    fetch(`${BASE_URL}/isLoggedIn`, {
      credentials: 'include'
    })
    .then((response) => {
      if (response.status === 200) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    })
  }, [])

  function handleLogout() {
    fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    .then(response => {
      if (response.status === 200) {
        setIsLoggedIn(false);
      } else {
        console.error("Failed to logout");
      }
    })
    .catch(error => console.error("Error during logout:", error));
  }

  return (
    <div className="bg-black">
      <nav>
        <div className="flex flex-row">
          <div className="flex flex-row flex-[3_0_0%] justify-center">
            <div className="link-wrapper bg-red-800 text-black">
              <Link href="/">Home</Link>
            </div>
            <div className="link-wrapper">
              <Link href="/anime">Anime</Link>
            </div>
            <div className="link-wrapper">
              <Link href="/manga">Manga</Link>
            </div>
            <div className="link-wrapper">
              <Link href="/customlists">CustomLists</Link>
            </div>
          </div>

          <div className="flex flex-row flex-[1_0_0%] justify-end">
            {isLoggedIn && isLoggedIn? (
              <div className="link-wrapper">
                <Link href="/profile">Profile</Link>
              </div>
            ):(
              <div className="link-wrapper">
                <Link href="/login">Login</Link>
              </div>
            )}
            <div className="link-wrapper">
              {isLoggedIn && isLoggedIn? (
                <div>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              ):(
              <div>
              </div>
            )}
          </div>
        </div>
        </div>
        
      </nav>
    </div>
  )
}

export default Navbar
