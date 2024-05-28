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
    <div>
      <nav>
        <div>
          <div>
            <Link href="/">Home</Link>
          </div>
          <div>
            <Link href="/anime">Anime</Link>
          </div>
          <div>
            <Link href="/manga">Manga</Link>
          </div>
          <div>
            <Link href="/customlists">CustomLists</Link>
          </div>
          {isLoggedIn && isLoggedIn? (
            <div>
              <Link href="/profile">Profile</Link>
            </div>
          ):(
            <div>
              <Link href="/login">Login</Link>
            </div>
          )}
        </div>
        {isLoggedIn && isLoggedIn? (
            <div>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ):(<div>
            </div>
          )}
        
      </nav>
    </div>
  )
}

export default Navbar
