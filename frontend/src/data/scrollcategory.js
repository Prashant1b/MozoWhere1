import media1 from "../assets/tshirtmodel.png"
import media2 from "../assets/p7.png"
import hoodie3 from "../assets/hoodie/printedredhoodie.jpeg";
import hoodie4 from "../assets/hoodie/blankredhoodie.jpeg";
import hoodie5 from "../assets/hoodie/blankwhitehoodiefront.jpeg"
import hoodie6 from "../assets/hoodie/animepritnedwhiteback.jpeg"

export const HERO_SLIDES = [
  {
    id: "Tshirt",
    variant: "Tshirt",
    image:media1,
      topTag: "ALL NEW",
    scriptTitle: "Flannel",
    subTitle: "TSHIRTS",
    link: "/tshirt",
  },
  {
    id: "Caps",
    variant: "Caps",
    image:media2,
     title:"Caps",
    subtitle: "Accessories",
     link: "/tshirt",
  },

  // extra “life-like” store promos
  {
    id: "hoodies-deal",
    variant: "bottomText",
   image:hoodie3,
     title: "Winter Hoodies",
    subtitle: "UPTO 40% OFF",
    link: "/tshirt",
  },
  {
    id: "denim-drop",
    variant: "leftOverlay",
    image:hoodie4,
      topTag: "NEW DROP",
    scriptTitle: "Denim",
    subTitle: "JACKETS",
     link: "/tshirt",
  },
  {
    id: "oversized-tees",
    variant: "bottomText",
    image:hoodie5, title: "Oversized Tees",
    subtitle: "STARTING ₹399",
     link: "/tshirt",
  },
  {
    id: "Hoodie",
    variant: "hooide",
   image:hoodie6,
    topTag: "TRENDING",
    scriptTitle: "Hoodie",
    subTitle: "WEAR",
     link: "/hoodie",
  },
];
