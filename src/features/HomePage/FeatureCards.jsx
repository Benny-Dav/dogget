import { div, section } from 'framer-motion/client'
import { CalendarCheck2, HeartHandshake, ShieldCheck, Truck } from 'lucide-react'
import React from 'react'


const features = [
    {
        id: 1,
        icon: <ShieldCheck color="#f4a52c" size={28} />,
        title: "Secure Payments",
        description: "Shop with confidence using secure payment"
    },
    {
        id: 2,
        icon: <Truck color="#f4a52c" size={28} />,
        title: "Fast Delivery",
        description: "Get pet supplies delivered to your door"
    },
    {
        id: 3,
        icon: <CalendarCheck2 color="#f4a52c" size={28} />,
        title: "Easy Returns",
        description: "30-day hassle-free return policy"
    },
    {
        id: 4,
        icon: <HeartHandshake color="#f4a52c" size={28} />,
        title: "Quality Products",
        description: "Trusted brands for your furry friends"
    }
]

const FeatureCards = () => {

    return (
        <section className='relative md:absolute flex justify-center items-center md:-mt-20 lg:-mt-24 z-40 mx-auto w-full px-4 py-8 md:py-0'>
            <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
            {features.map((feature)=>(
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl p-4 md:p-5 flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center hover:scale-105 transition-all duration-200" key={feature.id}>
                    <div className='flex-shrink-0'>{feature.icon}</div>
                    <div className='flex flex-col gap-1'>
                        <h3 className='text-[#f4a52c] font-semibold text-sm md:text-base'>{feature.title}</h3>
                        <p className='text-xs md:text-sm text-gray-600'>{feature.description}</p>
                    </div>
                </div>
            ))}
            </div>
        </section>
    )
}
export default FeatureCards;