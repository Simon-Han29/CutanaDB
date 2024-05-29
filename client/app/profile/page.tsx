'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
interface Account {
  "username": string,
  "uid": string,
  "animelist": {},
  "following": {},
  "followers": {},
  "customlists": {}
}

const ProfilePage = () => {
  const BASE_URL:string = "http://localhost:8080/api"
  const [accountData, setAccountData] = useState({
    "username": "",
    "uid": "",
    "animelist": {},
    "following": {},
    "followers": {},
    "customlists": {} 
  })
  useEffect(() => {
    fetch(`${BASE_URL}/account`, {
      credentials: 'include'
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else {
          console.log("ERROR: either 404 or 500")
        }
      })
      .then((accountData:Account) => {
        setAccountData(accountData)
      })
  }, [])

  return (
    <div>
      <Navbar/>
      Profile Page
    </div>
  )
}

export default ProfilePage