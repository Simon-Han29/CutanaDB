'use client'

import React, {useState} from 'react'

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
    <div>
      <input type="text" placeholder="Username" onChange={handleUsernameChange}/>
      <input type="text" placeholder="Password" onChange={handlePasswordChange}/>
      <button onClick={handleSignUp}>Create Account</button>
    </div>
  )
}

export default SignupPage;
