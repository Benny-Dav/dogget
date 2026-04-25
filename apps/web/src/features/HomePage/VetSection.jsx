import { section } from "framer-motion/client"
import { Calendar, PawPrint, Scissors, Stethoscope } from "lucide-react"
import PawScatter from "../HomePage/PawScatter"

const serviceCards = [
    { id: 1, name: "Veterinary Checkups", icon: <Stethoscope color="white" size={22} strokeWidth={3} />, description: "Routine and emergency care from certified veterinarians." },
    { id: 2, name: "Grooming Sessions", icon: <Scissors color="white" size={22} strokeWidth={3} />, description: "From full grooms to stylish trims, handled with gentle hands." },
    { id: 3, name: "Wellness Packages", icon: <PawPrint color="white" size={22} strokeWidth={3} />, description: "Personalized care packages for your dog’s long-term health." },
    { id: 4, name: "Instant Scheduling", icon: <Calendar color="white" size={22} strokeWidth={3} />, description: "View available slots and book your session in just a few taps." }

]
const VetSection = () => {
    return (
        <section className="relative h-[100vh] flex flex-col justify-center items-center px-4 pt-18 ">
            <div className="absolute flex z-0 -rotate-60 ml-[70%] mb-[30%]"><PawScatter pawCount={10} width={400} height={100} /> </div>
            {/* text  */}
            <div className="text-center gap-4">
                <h1 className="text-4xl font-extrabold leading-tight mb-2">Book Trusted Care for Your Pet</h1>
                <h3 className="font-bold text-[#fa7a3d] w-full mx-auto">Our verified vets and groomers are ready to pamper and protect your furry friend — whenever you need.</h3>
            </div>

            {/* content */}
            <div className="flex justify-between items-center gap-8">
                {/* left cards */}
                <div className="flex flex-col justify-between items-center gap-8 ">
                    {serviceCards.slice(0, 2).map((service) => (
                        <div key={service.id} className=" px-4 py-6 w-full">
                            <div className="flex justify-center items-center gap-2 text-right ">
                                <h3 className="font-extrabold ">{service.name}</h3>
                                <div className="w-14 h-12 bg-[#f4a52c] hover:bg-[#f6b756] rounded-full flex items-center justify-center">{service.icon}</div>
                            </div>
                            <p className="text-right">{service.description}</p>
                        </div>
                    ))}
                </div>

                {/* central image */}
                <div className= "flex justify-center items-center h-[500px] -mt-12">
                    <img src="https://res.cloudinary.com/dfb2hl46r/image/upload/v1751644816/pngwing.com_32_o70m6d.png" alt="" className="h-full object-cover" />
                </div>


                {/* right cards */}
                <div className="flex flex-col justify-between items-center gap-8">
                    {serviceCards.slice(2, 4).map((service) => (
                        <div key={service.id} className="px-4 py-6 w-full">
                            <div className="flex items-center gap-2 text-left ">
                                <div className="w-14 h-12 bg-[#f4a52c] hover:bg-[#f6b756] rounded-full flex items-center justify-center">{service.icon}</div>
                                <h3 className="font-extrabold ">{service.name}</h3>

                            </div>
                            <p className="">{service.description}</p>
                        </div>
                    ))}
                </div>


            </div>

            <div className="flex justify-center items-center">
                <button className="button">Book an Appointment Now</button>
            </div>
        </section>
    )
}
export default VetSection