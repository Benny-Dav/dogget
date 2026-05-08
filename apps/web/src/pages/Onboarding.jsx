import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { onboardingSlides } from "../features/HomePage/onboardingSlides";
import PawScatter from "../features/HomePage/PawScatter";

const Onboarding = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(0);

  return (
    <section className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-gradient-to-br from-[#f2f2f2] to-[#fffbe6] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
        <PawScatter
          pawCount={15}
          width={430}
          height={920}
          className="mx-auto h-full w-full max-w-[430px]"
          style={{ width: "100%", height: "100%", marginTop: 0 }}
        />
      </div>

      <main className="relative z-10 flex min-h-0 w-full flex-1">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false, stopOnLastSlide: true }}
          onSlideChange={(swiper) => setActiveId(swiper.activeIndex)}
          className="onboarding-swiper relative z-20 h-full w-full"
        >
          {onboardingSlides.map((slide, id) => (
            <SwiperSlide key={slide.id}>
              <div className="flex h-full min-h-0 flex-col items-center px-2 pb-14 pt-2 text-center">
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-[min(36dvh,15rem)] w-[min(72vw,17rem)] object-contain"
                  />
                  <h2 className="my-3 text-[clamp(1.75rem,7vw,2.25rem)] font-bold leading-tight text-[#2f2f2f]">
                    {slide.title}
                  </h2>
                  <p className="mt-1 w-[82%] text-[clamp(1rem,4.5vw,1.25rem)] leading-snug text-gray-600">
                    {slide.subtitle}
                  </p>
                </div>

                <div className="flex min-h-16 items-start justify-center">
                  {id === onboardingSlides.length - 1 && activeId === id && (
                    <button
                      onClick={() => navigate("/home")}
                      className="button mt-2 min-w-[10rem] whitespace-nowrap px-5 py-3 text-base leading-none sm:text-lg"
                    >
                      {slide.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </main>
    </section>
  );
};

export default Onboarding;
