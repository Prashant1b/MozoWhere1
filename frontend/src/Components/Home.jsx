
import FeaturedSection from "../Pages/Featuredsection";
import HoodieProduct from "../Pages/HoodieProduct";
import TrendingCategoriesPage from "../Pages/TrendingPage";
import Product from "../Pages/TshirtProduct";
import MainBanner from "./Banner";
import Footer from "./Footer";
import HomeHeroCarousel from "./HomeHeroSection";
export default function Home({ gender }) {
  return (
    <>
      <MainBanner/>
      <HomeHeroCarousel/>
      <Product gender={gender} />
      <HoodieProduct gender={gender} />
            <TrendingCategoriesPage />
      <FeaturedSection/>
      <Footer/>
    </>
  );
}
