import { section } from "framer-motion/client"
import { ShoppingBag } from "lucide-react"

const CTASection = () => {
    return (
        <section className="h-[20vh] px-6 py-4 ">
            <div className="rounded-xl text-center flex flex-col bg-[#f4a52c] py-4 px-2 text-white">
                <ShoppingBag className=" font-extrabold h-14 w-14 mb-4 flex justify-center self-center" />
                <h3 className="font-semibold text-2xl mb-2">Become a vendor!</h3>
                <p className="mb-4">Join the family as a vendor and start selling your products.</p>

                <button className="w-[60%] mx-auto px-6 py-4 bg-white text-[#f4a52c] font-semibold text-lg rounded-xl">Register Now</button>

            </div>

        </section>
    )
}

export default CTASection;