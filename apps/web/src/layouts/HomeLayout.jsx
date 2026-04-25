import { Outlet } from 'react-router-dom'
import Foot from '../reusableComponents/Footer'

const HomeLayout = () => {
  return (
    <div className='flex flex-col pb-[12vh]'>
      <main>
        <Outlet/>
      </main>
      <Foot/>
    </div>
  )
}

export default HomeLayout
