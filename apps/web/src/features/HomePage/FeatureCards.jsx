import { CalendarCheck2, HeartHandshake, ShieldCheck, Truck } from 'lucide-react'

const features = [
    {
        id: 1,
        icon: <ShieldCheck color="#f4a52c" size={24} />,
        title: "Secure Payments",
        description: "Shop with confidence"
    },
    {
        id: 2,
        icon: <Truck color="#f4a52c" size={24} />,
        title: "Fast Delivery",
        description: "Delivered to your door"
    },
    {
        id: 3,
        icon: <CalendarCheck2 color="#f4a52c" size={24} />,
        title: "Easy Returns",
        description: "30-day return policy"
    },
    {
        id: 4,
        icon: <HeartHandshake color="#f4a52c" size={24} />,
        title: "Quality Products",
        description: "Trusted brands only"
    }
]

const FeatureCards = () => {
    return (
        <section className='w-full py-4'>
            <div className='grid grid-cols-2 gap-3'>
                {features.map((feature) => (
                    <div
                        key={feature.id}
                        className='bg-white rounded-xl ring-1 ring-gray-100 p-3 flex flex-col items-start gap-2 hover:ring-[#f4a52c]/30 transition'
                    >
                        <div className='h-9 w-9 rounded-lg bg-[#f4a52c]/10 flex items-center justify-center'>
                            {feature.icon}
                        </div>
                        <div className='flex flex-col gap-0.5'>
                            <h3 className='text-gray-900 font-semibold text-sm'>{feature.title}</h3>
                            <p className='text-xs text-gray-500'>{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
export default FeatureCards;
