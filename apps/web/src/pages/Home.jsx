import GreetingSection from '../features/HomePage/GreetingSection.jsx'
import HeroBanner from '../features/HomePage/HeroBanner.jsx'
import CategoriesSection from '../features/HomePage/CategoriesSection.jsx'
import RecommendedSection from '../features/HomePage/RecommendedSection.jsx'
import AdSection from '../features/HomePage/AdSection.jsx'
import CTASection from '../features/HomePage/CTASection.jsx'
import TrustSection from '../features/HomePage/TrustSection.jsx'

const Home = () => {
  return (
    <div>
      <GreetingSection/>
      <HeroBanner/>
      <CategoriesSection/>
      <RecommendedSection/>
      <AdSection/>
      <TrustSection/>
      <CTASection/>
    </div>
  )
}

export default Home
