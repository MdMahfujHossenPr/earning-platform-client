import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Import Swiper styles

const Testimonials = () => {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-semibold">What Our Users Say</h2>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          className="mt-8"
        >
          <SwiperSlide>
            <div className="flex flex-col items-center">
              <img className="w-24 h-24 rounded-full" src="/path/to/user1.jpg" alt="User 1" />
              <p className="mt-4 text-lg">"This platform is amazing! I earned coins quickly."</p>
              <p className="mt-2 text-xl font-bold">John Doe</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col items-center">
              <img className="w-24 h-24 rounded-full" src="/path/to/user2.jpg" alt="User 2" />
              <p className="mt-4 text-lg">"A great way to make some extra money in my free time."</p>
              <p className="mt-2 text-xl font-bold">Jane Smith</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
