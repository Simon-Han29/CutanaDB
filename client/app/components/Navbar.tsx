import React from 'react'
import Link from "next/link"
const Navbar = () => {
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
        </div>
        
        
      </nav>
    </div>
  )
}

export default Navbar
