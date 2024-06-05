'use client'
import { useRouter } from 'next/navigation'
import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
const LoginPage = () => {
  const BASE_URL:string = "http://localhost:8080/api"
  const [usernameText, setUsernameText] = useState("")
  const [passwordText, setPasswordText] = useState("")

  const router = useRouter();
  function handleUsernameChange(event:any) {
    setUsernameText(event.target.value)
    console.log("username:" + usernameText)
  }

  function handlePasswordChange(event:any) {
    setPasswordText(event.target.value)
    console.log("password:" + passwordText)
  }

  function handleLogin() {
    fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        "username": usernameText,
        "password": passwordText
      }),
      credentials: 'include'
    })
    .then((response) => {
      if(response.status === 201) {
        console.log("successful login")
        router.push("/")
      } else if (response.status === 404) {
        console.log("username does not exist")
      } else if (response.status === 401) {
        console.log("incorrect password")
      }
    })
  }

  return (
    <div>
      <Navbar />
      <input type="text" placeholder="Username" onChange={handleUsernameChange}/>
      <input type="text" placeholder="Password" onChange={handlePasswordChange}/>
      <button onClick={handleLogin}>Login</button>
      <Link href="/signup">{"Don't have an account? Sign up"}</Link>
    </div>
  )
}

export default LoginPage
