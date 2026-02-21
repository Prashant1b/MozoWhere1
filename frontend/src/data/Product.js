

import menimage from  "../assets/mengreyprinted.jpeg";
import menimageback from "../assets/mengreypintedback.jpeg"
import media1 from "../assets/whitetshirtfront.jpeg";
import media2 from "../assets/whiteprintedback.jpeg";
import media3 from "../assets/whitepritnedfront1.jpeg";
import media4 from "../assets/smileyprintedyellowfront.jpeg";
import media5 from "../assets/smileyprintedyellowback.jpeg";
import media6 from "../assets/animeprintedwhitefront.jpeg";
import media7 from "../assets/animeprintedyellowfront.jpeg";
import media8 from "../assets/yellowblank.jpeg";
import media9 from "../assets/dragonblueprintedfront.jpeg";
import media10 from "../assets/dragonblueprintedback.jpeg";
import media11 from "../assets/juiceprintedbluefront.jpeg";
import media12 from "../assets/blueblank.jpeg"
import media13 from "../assets/womentshirtwhitefront.jpeg";
import media14 from "../assets/womentshirtwhiteback.jpeg";
import hoodie1 from "../assets/hoodie/printedwhitehoodie.jpeg";
import hoodie2 from "../assets/hoodie/blankwhitehoodie.jpeg";
import hoodie3 from "../assets/hoodie/printedredhoodie.jpeg";
import hoodie4 from "../assets/hoodie/blankredhoodie.jpeg";
import hoodie5 from "../assets/hoodie/blankwhitehoodiefront.jpeg"
import hoodie6 from "../assets/hoodie/animepritnedwhiteback.jpeg"
import hoodie7 from "../assets/hoodie/dragonprintedfront.jpeg";
import hoodie8 from "../assets/hoodie/dragonprintedback.jpeg";
import hoodie9 from "../assets/hoodie/stickerprintedfront.jpeg";
import hoodie10 from "../assets/hoodie/stickerprintedback.jpeg";
import hoodie11 from "../assets/hoodie/womenwhitehoodiefront.jpeg";
import hoodie12 from "../assets/hoodie/womenwhitehoodieback.jpeg";
import hoodie13 from "../assets/hoodie/womenyellowprintedhoodiefront.jpeg";
import hoodie14 from "../assets/hoodie/womenyellowprintedhoodieback.jpeg";



export const PRODUCTS=[
  {
    id: "1",
    brand: "Mozowhere®",
    title: "Men Grey Printed T-Shirt",
    price: 399,
    gender: "Men",
    category: "t-shirts",
    mrp: 999,
    off: 43,
    rating: 4.5,
    badge: "BUY 2 FOR 699",
    lowAs:370,
    image: menimage,
     images: [
        menimage,
        menimageback
    ],
  },
  {
    id: "2",
    brand: "Mozowhere®",
    title: "Men White Printed T-Shirt",
    price: 399,
    mrp: 949,
    gender: "Men",
    category: "t-shirts",
    off: 39,
    rating: 4.5,
    badge: "BUY 2 FOR 699",
    image: media1,
    lowAs:370,
      images: [
        media1,
        media2
    ],
  },
  {
    id: "3",
    brand: "Mozowhere®",
    title: "Men's Black Oversized Tshirt",
    price: 399,
    category: "t-shirts",
    gender: "Men",
    mrp: 1099,
    off: 45,
    rating: 4.3,
    badge: "BUY 2 FOR 699",
    image: media3,
    lowAs:370,
     images: [
        media3,
        media2
    ],
  },
  {
    id: "4",
    brand: "Mozowhere®",
    title: "Men Smiley Yellow Printed T-Shirt",
    price: 399,
    mrp: 799,
    gender: "Men",
    off: 28,
    rating: 4.4,
    badge: "BUY 2 FOR 699",
    image: media4,
    category: "t-shirts",
    lowAs:370,
     images: [
        media4,
        media5
    ],
  },
  {
    id: "5",
    brand: "Mozowhere®",
    title: "Men Anime White Printed T-Shirt",
    price: 399,
    mrp: 1249,
    gender: "Men",
    off: 56,
    rating: 4.4,
    badge: "BUY 2 FOR 699",
    category: "t-shirts",
    image: media6,
    lowAs:370,
    images: [
        media6,
        media2
    ],
  },
  {
    id: "6",
    brand: "Mozowhere®",
    title: "Men Anime Yellow Printed T-Shirt",
    price: 399,
    mrp: 1249,
    gender: "Men",
    off: 56,
    category: "t-shirts",
    rating: 4.4,
    lowAs:370,
    badge: "BUY 2 FOR 699",
    image: media7,
    images: [
        media7,
        media8
    ],
  },
  {
    id: "7",
    brand: "Mozowhere®",
    title: "Men Dragon Blue Printed T-Shirt",
    price: 399,
    mrp: 899,
    category: "t-shirts",
    gender: "Men",
    off: 39,
    rating: 4.5,
    badge: "BUY 2 FOR 699",
    image: media9,
    lowAs:370,
    images: [
        media9,
        media10
    ],
  },
  {
    id: "8",
    brand: "Mozowhere®",
    title: "Men Dragon Blue Printed T-Shirt",
    price: 399,
    mrp: 699,
    gender: "Men",
    category: "t-shirts",
    off: 15,
    rating: 4.5,
    lowAs:370,
    badge: "BUY 2 FOR 699",
    image: media11,
    images: [
        media11,
        media12
    ],
  },
    {
    id: "9",
    brand: "Mozowhere®",
    title: "Women Sticker Printed White Tshirt",
    price: 399,
    category: "t-shirts",
    mrp: 699,
    off: 15,
    gender: "Women",
    rating: 4.5,
    lowAs:370,
    badge: "BUY 2 FOR 699",
    image: media13,
    images: [
        media13,
        media14
    ],
  },
   {
      id: "10",
      brand: "Mozowhere®",
      title: "Men Anime White Printed SweatShirt",
      price: 599,
      mrp: 1299,
      off: 35,
      category: "sweatshirt",
      gender:"Men",
      rating: 4.5,
      badge: "BUY 2 FOR 1160",
      lowAs:580,
      image: hoodie1,
       images: [
          hoodie1,
          hoodie2
      ],
    },
    {
      id: "11",
      brand: "Mozowhere®",
      title: "Men Sticker Red Printed SweatShirt",
      price: 599,
      mrp: 1249,
     category: "sweatshirt",
      gender:"Men",
      off: 39,
      rating: 4.5,
      badge: "BUY 2 FOR 1149",
      image: hoodie3,
      lowAs:580,
        images: [
          hoodie3,
          hoodie4
      ],
    },
    {
      id: "12",
      brand: "Mozowhere®",
      title: "Men Anime White Printed SweatShirt",
      price: 699,
      category: "sweatshirt",
      gender:"Men",
      mrp: 1399,
      off: 45,
      rating: 4.3,
      badge: "BUY 2 FOR 1299",
      image: hoodie5,
      lowAs:650,
       images: [
           hoodie5,
          hoodie6
      ],
    },
    {
      id: "13",
      brand: "Mozowhere®",
      title: "Men Dragon  Printed Hoodie",
      price: 499,
      mrp: 999,
      gender:"Men",
      category: "hoodie",
      off: 28,
      rating: 4.4,
      badge: "BUY 2 FOR 999",
      image: hoodie7,
      lowAs:449,
       images: [
          hoodie7,
          hoodie8
      ],
    },
    {
      id: "14",
      brand: "Mozowhere®",
      title: "Women Sticker Printed White  SweatShirt",
      price: 699,
      mrp: 1549,
      off: 56,
      gender:"Women",
      category: "sweatshirt",
      rating: 4.4,
      badge: "BUY 2 FOR 1299",
      image: hoodie11,
      lowAs:650,
      images: [
           hoodie11,
          hoodie12
      ],
    },
    {
      id: "15",
      brand: "Mozowhere®",
      title: "Women Sticker Printed Hoodie",
      price: 999,
      mrp: 1249,
      category: "hoodie",
      off: 20,
      gender:"Women",
      rating: 4.4,
      lowAs:970,
      badge: "BUY 2 FOR 1949",
      image: hoodie9,
      images: [
          hoodie9,
          hoodie10
      ],
    },
    {
      id: "16",
      brand: "Mozowhere®",
      title: "Women Sticker Printed Yellow Hoodie",
      price: 599,
      mrp: 899,
      off: 19,
      gender:"Women",
      category: "hoodie",
      rating: 4.5,
      badge: "BUY 2 FOR 1099",
      image: hoodie13,
      lowAs:570,
      images: [
          hoodie13,
          hoodie14
      ],
    }
];





