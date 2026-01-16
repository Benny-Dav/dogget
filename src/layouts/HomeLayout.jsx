import React from 'react'

import { Outlet } from 'react-router-dom'

import Foot from '../reusableComponents/Footer'
import MainLayout from './MainLayout'

const HomeLayout = () => {
  return (
  
      <div className='flex flex-col justify-between absolute px-6'>

      <main className='pb-2'>
        <Outlet/>
      </main>

      <Foot/>
    </div>

    
  )
}

export default HomeLayout