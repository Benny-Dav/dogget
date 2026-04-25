import { ShoppingBag } from "lucide-react"

const CTASection = () => {
    return (
        <section className="px-6 py-4">
            <div className="relative overflow-hidden rounded-2xl text-center flex flex-col bg-gradient-to-br from-[#f4a52c] to-[#fa7a3d] py-6 px-5 text-white shadow-md">
                <p className="text-xs uppercase tracking-widest text-white/80 mb-2">For businesses</p>
                <div className="h-14 w-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-2xl mb-1">Become a vendor!</h3>
                <p className="text-sm text-white/90 mb-5">Join the family as a vendor and start selling your products.</p>
                <button className="w-full py-3 bg-white text-[#f4a52c] font-semibold rounded-full hover:bg-white/90 transition">
                    Register Now
                </button>
            </div>
        </section>
    )
}

export default CTASection;
