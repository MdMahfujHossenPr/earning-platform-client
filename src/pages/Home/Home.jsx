import React from "react";
import HeroSlider from "./HeroSlider";
import BestWorkers from "./BestWorkers";
import Testimonials from "./Testimonials";
import SectionOne from "./Extras/SectionOne";
import SectionTwo from "./Extras/SectionTwo";
import SectionThree from "./Extras/SectionThree";

const Home = () => {
  return (
    <div>
      <HeroSlider/>
      <BestWorkers/>
      <Testimonials/>
      <SectionOne/>
      <SectionTwo/>
      <SectionThree/>
    </div>
  );
};

export default Home;
