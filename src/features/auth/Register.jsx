'use client'
import dogRegister from "../../assets/dogRegister.svg"
import React from 'react'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const navigate = useNavigate();
  //state to switch between register and login
  const [isRegister, setIsRegister] = useState(true);

  const switchStatus = () => {
    setIsRegister(!isRegister);
  }

  return (
    <section className='py-32 h-[100vh] border bg-[#f4a52c] flex flex-col z-10 relative'>
      <img src={dogRegister} alt="" className="h-50 z-30 relative bottom-27" />
      <div className='h-[74%] w-full bottom-0 absolute z-20 bg-[#FFE4c4] rounded-t-3xl'>
        <div className='bg-white h-[95%] w-full bottom-0 absolute z-20 rounded-t-4xl px-8 pt-6'>

          <h1 className='text-center font-extrabold text-3xl mb-6'>{isRegister ? "Register" : "Log In"}</h1>

          <form action="">
            <div className='flex flex-col gap-1 mb-4'>
              {/* <label htmlFor="full-name" className='font-bold text-lg'>Full Name</label> */}
              {/* <input name="full-name" type="text" placeholder='Enter your name' className=' text-lg text-gray-600 border border-gray-300 outline-[#f4a52c] rounded-xl px-4 py-2' /> */}
            </div>

            <div className='flex flex-col gap-1 mb-4'>
              {/* <label htmlFor="email" className='font-bold text-lg'>Email</label> */}
              <input name="email" type="email" placeholder='Enter your email' className=' text-lg text-gray-600 border border-gray-300 outline-[#f4a52c] rounded-xl px-4 py-2' />
            </div>

            {isRegister ? <div className='flex flex-col gap-1 mb-6'>
              {/* <label htmlFor="password" className='font-bold text-lg'>Password</label> */}
              <input name="password" type="text" placeholder='Choose a password' className='text-lg text-gray-600 border border-gray-300 outline-[#f4a52c] rounded-xl px-4 py-2' />
            </div> : null}

            <button onClick={()=>navigate("/")} className='w-full bg-[#f4a52c] text-white font-semibold mx-auto py-2 rounded-xl text-xl hover:bg-[#FFE4c4] hover:shadow-lg'>{isRegister ? "Register" : "Log In"}</button>

            {/* <div className="py-2">
              <span className="flex justify-center items-center text-gray-500"> Or sign up with </span>
            </div> */}

            <div className="flex justify-center gap-2 items-center">
              <p className='text-center text-gray-600 text-lg mt-6 '>{isRegister ?"Already have an account? " : "Don't have an account? "}</p>
              <span onClick={switchStatus} className='text-lg mt-6 text-[#f4a52c]'>{isRegister ? " Log In" : " Register"}</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Register