import { section } from "framer-motion/client"
import FeatureCards from "./FeatureCards";

const TrustSection=()=>{

return(
<section className="h-auto py-4 px-6 ">
<h1 className="text-gray-600 text-2xl font-bold text-center mt-4">Why Trust Us?</h1>
    <main className="">
        <FeatureCards/>

    </main>
</section>
)
}

export default TrustSection;