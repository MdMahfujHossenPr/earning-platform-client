import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";  // Import Swiper styles

const HeroSlider = () => {
  return (
    <section className="relative h-screen">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        className="absolute top-0 w-full h-full"
      >
        <SwiperSlide>
          <div className="h-full bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/banner1.jpg)' }}>
            <div className="flex items-center justify-center h-full bg-black bg-opacity-40">
              <div className="text-center text-white px-6">
                <h1 className="text-5xl font-bold">Welcome to the Micro-Task Platform</h1>
                <p className="mt-4 text-xl">Complete small tasks and earn rewards!</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-full bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/banner2.jpg)' }}>
            <div className="flex items-center justify-center h-full bg-black bg-opacity-40">
              <div className="text-center text-white px-6">
                <h1 className="text-5xl font-bold">Earn Coins with Every Task</h1>
                <p className="mt-4 text-xl">Start earning by completing tasks and get rewards!</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-full bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/banner3.jpg)' }}>
            <div className="flex items-center justify-center h-full bg-black bg-opacity-40">
              <div className="text-center text-white px-6">
                <h1 className="text-5xl font-bold">Join the Earning Community</h1>
                <p className="mt-4 text-xl">Be a part of our growing platform.</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default HeroSlider;
