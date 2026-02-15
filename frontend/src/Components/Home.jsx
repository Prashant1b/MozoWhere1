
import FeaturedSection from "../Pages/Featuredsection";
import HoodieProduct from "../Pages/HoodieProduct";
import Product from "../Pages/TshirtProduct";
import MainBanner from "./Banner";
import Footer from "./Footer";
export default function Home({ gender }) {
  return (
    <>
      <MainBanner/>
      <Product gender={gender} />
      <HoodieProduct gender={gender} />
      <FeaturedSection/>
      <Footer/>
    </>
  );
}
