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
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className='flex-1 flex min-h-[95vh] border justify-center items-center'>
        <div className='flex flex-col items-center text-white border w-[400px] h-[500px] rounded-[20px]'>
          <h1 className="text-3xl m-4">Sign in</h1>
          <input className="m-2 p-2 rounded-[20px] text-black outline-none" type="text" placeholder="Username" onChange={handleUsernameChange}/>
          <input className="m-2 p-2 rounded-[20px] text-black outline-none" type="text" placeholder="Password" onChange={handlePasswordChange}/>
          <button className="m-2 p-2 border w-[150px] h-[50px]" onClick={handleLogin}>Login</button>
          <Link href="/signup">{"Don't have an account? Sign up"}</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
