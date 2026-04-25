import React from 'react'
import { onboardingSlides } from '../features/HomePage/onboardingSlides';
import PawScatter from '../features/HomePage/PawScatter';
import { Swiper, SwiperSlide } from 'swiper/react';


import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { button } from 'framer-motion/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Onboarding = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(0);

  return (
    <section className="h-screen relative bg-gradient-to-br from-[#f2f2f2] to-[#fffbe6] flex flex-col md:flex-row items-center justify-between px-4 md:px-8 lg:px-12 pt-20 pb-6 md:py-0 overflow-hidden">
      {/* PawScatter as subtle background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden opacity-50">
        <PawScatter pawCount={15} width={1200} height={800} />
      </div>

      <main className='z-10 relative w-full h-full md:w-[40%] md:m-auto md:h-[80%]  '>
        {/* onboardingimage */}
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}

          pagination={{
            clickable: true,
          }}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false, stopOnLastSlide: true }}
          onSlideChange={(swiper) => setActiveId(swiper.activeIndex)}
          className='w-full h-full relative z-20 '>

          {onboardingSlides.map((slide, id)=>

          (<SwiperSlide key={slide.id}>
            <div className=" flex flex-col h-full items-center text-center md:pt-6">
              <img src={slide.image} alt="" className="w-70 h-60 md:w-70 md:h-70 object-contain" />
              <h2 className="text-3xl md:text-2xl font-bold my-4">{slide.title}</h2>
              <p className="text-gray-600 text-xl md:text-lg mt-2 md:w-[70%] md:mx-auto ">{slide.subtitle}</p>

              {id === onboardingSlides.length - 1 && activeId === id && (
                <button onClick={()=>navigate("/home")} className='button cursor-pointer mt-4 w-[50%] md:w-[50%] px-6 md:px-4 py-3 md:py-2 bg-[#f4a52c] text-white text-xl md:text-sm font-semibold md:font-bold rounded-4xl relative bottom-0'>{slide.buttonText}</button>
              )}
            
            </div>
          </SwiperSlide>)

          )}

        </Swiper>
      </main>


    </section>
  )
}

export default Onboarding;