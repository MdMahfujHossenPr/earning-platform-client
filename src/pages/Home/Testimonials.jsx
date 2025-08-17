import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const testimonials = [
  {
    id: 1,
    name: "John Carter",
    message:
      "This platform completely changed the way I earn online. Reliable, fast, and user-friendly.",
    image: "https://i.ibb.co/Rkdh6phJ/profile-pic1.jpg",
  },
  {
    id: 2,
    name: "Sara Collins",
    message:
      "I was able to earn extra money while studying. The interface is so smooth and clean!",
    image: "https://i.ibb.co/NnjtVjw8/profile-three.jpg",
  },
  {
    id: 3,
    name: "Leo Williams",
    message:
      "Tasks are simple yet rewarding. I recommend it to everyone who wants legit income.",
    image: "https://i.ibb.co/Q7mvxFCb/Screenshot-2025-05-14-102943.png",
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight">
          💬 Hear From Our Users
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl text-white transition-all duration-500 hover:scale-[1.015]">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-500 mx-auto object-cover shadow-md"
                />
                <p className="mt-6 text-lg italic leading-relaxed max-w-2xl mx-auto">
                  “{t.message}”
                </p>
                <p className="mt-4 text-xl font-semibold text-blue-400">
                  — {t.name}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
