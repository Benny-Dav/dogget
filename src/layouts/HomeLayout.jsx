import React from 'react'
import Navbar from '../reusableComponents/Navbar'
import { Outlet } from 'react-router-dom'
import BottomMenu from '../reusableComponents/BottomMenu'

const HomeLayout = () => {
  return (
    <div className='flex flex-col justify-between'>
      <main className='pb-2'>
        <header>
          <Navbar />
        </header>


        <Outlet />
      </main>

      <footer className='mt-[8vh]'>
        {/* <BottomMenu /> */}
      </footer>

    </div>
  )
}

export default HomeLayout