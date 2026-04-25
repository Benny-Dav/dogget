import { Link } from "react-router-dom";

const AdSection = () => {
    return (
        <section className="w-full py-4 px-6">
            <Link to="/shop" className="block overflow-hidden rounded-2xl aspect-[16/9]">
                <img
                    src="https://res.cloudinary.com/dfb2hl46r/image/upload/v1759410221/ad1_qzy2au.jpg"
                    alt="Shop the latest pet deals"
                    className="w-full h-full object-cover"
                />
            </Link>
        </section>
    );
}

export default AdSection;
