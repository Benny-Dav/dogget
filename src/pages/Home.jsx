import React from 'react'
import HeroSection from '../features/HomePage/HeroSection.jsx'
import FeatureCards from '../features/HomePage/FeatureCards.jsx'
import ShopSection from '../features/HomePage/ShopSection.jsx'
import VetSection from '../features/HomePage/VetSection.jsx'
import TrustSection from '../features/HomePage/TrustSection.jsx'
import AdSection from '../features/HomePage/AdSection.jsx'
import CTASection from '../features/HomePage/CTASection.jsx'

const Home = () => {
  return (
    <>
    <div className=' '>
    <HeroSection/>
    <AdSection/>
    <TrustSection/>
    <CTASection/>
    {/* <FeatureCards/> */}
    {/* <ShopSection/> */}
    {/* <VetSection/> */}
    </div>
    </>
  )
}

export default Home