
import FeaturedSection from "../Pages/Featuredsection";
import TrendingCategoriesPage from "../Pages/TrendingPage";
import MainBanner from "./Banner";
import Footer from "./Footer";
import HomeHeroCarousel from "./HomeHeroSection";
export default function Home({ gender }) {
  return (
    <>
      <MainBanner/>
      <HomeHeroCarousel/>
            <TrendingCategoriesPage />
      <FeaturedSection/>
      <Footer/>
    </>
  );
}
