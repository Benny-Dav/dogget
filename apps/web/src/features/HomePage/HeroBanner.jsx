import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <section className="px-6 py-3">
      <Link
        to="/shop"
        className="block overflow-hidden rounded-2xl aspect-[16/10] shadow-sm"
      >
        <img
          src="https://res.cloudinary.com/dfb2hl46r/image/upload/v1759078352/Crunchy_Coconut_Treats_ivfsff.jpg"
          alt="Surprise your dog with a delicious dose of dietary fibre"
          className="w-full h-full object-cover"
        />
      </Link>
    </section>
  );
};

export default HeroBanner;
