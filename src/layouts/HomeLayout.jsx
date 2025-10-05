import React from 'react'
import Navbar from '../reusableComponents/Navbar'
import { Outlet } from 'react-router-dom'
import BottomMenu from '../reusableComponents/BottomMenu'
import Foot from '../reusableComponents/Footer'

const HomeLayout = () => {
  return (
    <div className='flex flex-col justify-between'>
      <main className='pb-2'>

        <Navbar />

        <Outlet />



      </main>
    </div>
  )
}

export default HomeLayout