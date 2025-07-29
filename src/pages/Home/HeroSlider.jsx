import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const HeroSlider = () => {
  return (
    <section className="relative h-[55vh] md:h-[65vh] lg:h-[75vh] overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        className="w-full h-full"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center"
            style={{
              backgroundImage: "url(https://i.ibb.co/Kx3tcHFw/Banner1.jpg)",
            }}
          >
            <div className="flex items-center justify-center h-full bg-black/50 px-4">
              <div className="text-center text-white max-w-2xl animate-fade-in">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-md">
                  Welcome to the Micro-Task Platform
                </h1>
                <p className="mt-2 md:mt-4 text-sm md:text-lg font-medium drop-shadow-sm">
                  Complete small tasks and earn rewards!
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center"
            style={{
              backgroundImage: "url(https://i.ibb.co/sJFVSBbp/Banner3.jpg)",
            }}
          >
            <div className="flex items-center justify-center h-full bg-black/50 px-4">
              <div className="text-center text-white max-w-2xl animate-fade-in">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-md">
                  Earn Coins with Every Task
                </h1>
                <p className="mt-2 md:mt-4 text-sm md:text-lg font-medium drop-shadow-sm">
                  Start earning by completing tasks and get rewards!
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center"
            style={{
              backgroundImage: "url(https://i.ibb.co/93pj1Mr6/Banner2.png)",
            }}
          >
            <div className="flex items-center justify-center h-full bg-black/50 px-4">
              <div className="text-center text-white max-w-2xl animate-fade-in">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-md">
                  Join the Earning Community
                </h1>
                <p className="mt-2 md:mt-4 text-sm md:text-lg font-medium drop-shadow-sm">
                  Be a part of our growing platform.
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default HeroSlider;
