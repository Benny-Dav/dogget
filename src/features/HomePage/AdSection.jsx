import { section } from "framer-motion/client";

const AdSection = () => {
    return (
        <section className="h-[25vh] w-full py-4 px-6">
            <div className="object-cover object-center h-full w-full">
                <img src="https://res.cloudinary.com/dfb2hl46r/image/upload/v1759410221/ad1_qzy2au.jpg" alt="" className="rounded-lg"/>
            </div>

        </section>
    );
}

export default AdSection;