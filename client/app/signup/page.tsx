'use client'

import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
const SignupPage = () => {
  const BASE_URL:string = "http://localhost:8080/api"
  const [usernameText, setUsernameText] = useState("")
  const [passwordText, setPasswordText] = useState("")

  function handleUsernameChange(event:any) {
    setUsernameText(event.target.value)
    console.log("username:" + usernameText)
  }

  function handlePasswordChange(event:any) {
    setPasswordText(event.target.value)
    console.log("password:" + passwordText)
  }

  function handleSignUp() {
    if (usernameText.length < 3) {
      return;
    } 

    if (passwordText.length < 3) {
      return;
    }

    fetch(`${BASE_URL}/signup`, {
      "method": "POST",
      "headers": {
        "Content-type": "application/json"
      },
      "body": JSON.stringify({
        "username": usernameText,
        "password": passwordText
      })
    })
    .then((response) => {
      if (response.status === 201) {
        console.log("Account created successfully")
      } else {
        console.log("Error creating account")
      }
    })
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className='flex-1 flex min-h-[95vh] border justify-center items-center'>
        <div className='flex flex-col items-center text-white border w-[400px] h-[500px] rounded-[20px]'>
          <h1 className="text-3xl m-4">Sign up</h1>
          <input className="m-2 p-2 rounded-[20px] text-black outline-none" type="text" placeholder="Username" onChange={handleUsernameChange}/>
          <input className="m-2 p-2 rounded-[20px] text-black outline-none" type="text" placeholder="Password" onChange={handlePasswordChange}/>
          <button className="m-2 p-2 border w-[150px] h-[50px]" onClick={handleSignUp}>Create Account</button>
          <Link href="/login">Already have an account? Login</Link>
        </div>
      </div>

    </div>
  )
}

export default SignupPage;
