import media1 from "../assets/mockups/tshirt-front.webp"
import media2 from "../assets/mockups/tshirt-back.webp"
import media3 from "../assets/gallery/p1.png"
import media101 from "../assets/DTF/media1.png";
import media202 from "../assets/DTF/media2.png";
import media303 from "../assets/DTF/media3.png";
import media4 from "../assets/DTF/media4.png";
import media5 from "../assets/DTF/media5.png";
import media6 from "../assets/DTF/media6.png";
import media7 from "../assets/DTF/media7.png";
import media8 from "../assets/DTF/0c906ac312f062dd9eefb54bb54e9ba8.png";
import media9 from "../assets/DTF/000e751c753c33b3f3f63afcb62d7f6a.png";
import media10 from "../assets/DTF/000e751c753c33b3f3f63afcb62d7f6qq.png";
import media11 from "../assets/DTF/1.png"
import media12 from "../assets/DTF/3afb4fa1e95fcd4d17a37ac25ce9cb9d.png";
import media13 from "../assets/DTF/4.png";
import media14 from "../assets/DTF/04afbdeeed7054300a2bda8b5ea8e846.png";
import media15 from "../assets/DTF/4d10cae629b326710d75438b25105741.png";
import media16 from "../assets/DTF/5.png";
import media17 from "../assets/DTF/6.png";
import media18 from "../assets/DTF/7.png";
import media19 from "../assets/DTF/8.png";
import media20 from "../assets/DTF/8b69c61838f54c6dfdf47e51ebb86b14.png";
import media21 from "../assets/DTF/11.png";
import media22 from "../assets/DTF/12.png";
import media23 from "../assets/DTF/14.png";
import media24 from "../assets/DTF/15.png";
import media25 from "../assets/DTF/16.png";
import media26 from "../assets/DTF/17.png";
import media27 from "../assets/DTF/18.png";
import media28 from "../assets/DTF/21.png";
import media29 from "../assets/DTF/23.png";
import media30 from "../assets/DTF/32.png";
import media31 from "../assets/DTF/36.png";
import media32 from "../assets/DTF/37.png";
import media33 from "../assets/DTF/38.png";
import media34 from "../assets/DTF/39.png";
import media35 from "../assets/DTF/41.png";
import media36 from "../assets/DTF/49.png";
import media37 from "../assets/DTF/53 - Copy.png";
import media38 from "../assets/DTF/57 - Copy.png";
import media39 from "../assets/DTF/062e5dcf76870a9252a679c728ac5c0d.png";
import media40 from "../assets/DTF/112.png";
import media41 from "../assets/DTF/113.png";
import media42 from "../assets/DTF/114.png";
import media43 from "../assets/DTF/115.png";
import media44 from "../assets/DTF/116.png";
import media45 from "../assets/DTF/444.png";
import media46 from "../assets/DTF/1111.png";
import media47 from "../assets/DTF/1112.png";
import media48 from "../assets/DTF/1888.png";
import media49 from "../assets/DTF/2222.png";
import media50 from "../assets/DTF/111111.png";
import media51 from "../assets/DTF/a24c6e27064c9e1a34562ae1a26ddd9b.png";
import capFront  from "../assets/p7.png"

export const STEPS = [
  { id: 1, label: "Pick Color & Size" },
  { id: 2, label: "Finalise Design" },
  { id: 3, label: "Preview" },
];

export const COLORS = [
  { id: "blue", name: "Blue", hex: "#2C76E8" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "sky", name: "Sky", hex: "#BFE0F6" },
  { id: "lavender", name: "Lavender", hex: "#CFCDF6" },
  { id: "mint", name: "Mint", hex: "#BFD8CF" },
  { id: "sand", name: "Sand", hex: "#D2B38F" },
];

export const SIZES = [
  { id: "XS", stock: 2 },
  { id: "S", stock: 0 }, // disabled
  { id: "M", stock: 3 },
  { id: "L", stock: 3 },
  { id: "XL", stock: 5 },
  { id: "2XL", stock: 3 },
  { id: "3XL", stock: 1 },
];

export const MOCKUPS_BY_PRODUCT = {
  tshirt: { front: media1, back: media2 },
  cap: { front: capFront, back: capFront }, // back nahi hai to same
};

export const GALLERY_TABS = [
  { id: "worldcup", label: "WorldCup" },
  { id: "DTFprints", label: "DTFPrints" },
  { id: "birthday", label: "Birthday" },
  { id: "pride", label: "Pride" },
  { id: "reactions", label: "Reactions" },
  { id: "favourites", label: "Favourites" },
];

export const GALLERY_ITEMS = {
  worldcup: [
    { id: "wc1", src: media3, title: "INDIA" },
    { id: "wc2", src: media3, title: "CHAMPIONS" },
  ],
  DTFprints:[
      { id: "dtf1", src: media101, title: "DTF PRINTS" },
      { id: "dtf2", src: media202, title: "DTF PRINTS" },
      { id: "dtf3", src: media303, title: "DTF PRINTS" },
      { id: "dtf4", src: media4, title: "DTF PRINTS" },
      { id: "dtf5", src: media5, title: "DTF PRINTS" },
      { id: "dtf6", src: media6, title: "DTF PRINTS" },
      { id: "dtf7", src: media7, title: "DTF PRINTS" },
      { id: "dtf8", src: media8, title: "DTF PRINTS" },
      { id: "dtf9", src: media9, title: "DTF PRINTS" },
      { id: "dtf10", src: media10, title: "DTF PRINTS" },
      { id: "dtf11", src: media11, title: "DTF PRINTS" },
      { id: "dtf12", src: media12, title: "DTF PRINTS" },
      { id: "dtf13", src: media13, title: "DTF PRINTS" },
      { id: "dtf14", src: media14, title: "DTF PRINTS" },
      { id: "dtf15", src: media15, title: "DTF PRINTS" },
      { id: "dtf16", src: media16, title: "DTF PRINTS" },
      { id: "dtf17", src: media17, title: "DTF PRINTS" },
      { id: "dtf18", src: media18, title: "DTF PRINTS" },
      { id: "dtf19", src: media19, title: "DTF PRINTS" },
      { id: "dtf20", src: media20, title: "DTF PRINTS" },
      { id: "dtf21", src: media21, title: "DTF PRINTS" },
      { id: "dtf22", src: media22, title: "DTF PRINTS" },
      { id: "dtf23", src: media23, title: "DTF PRINTS" },
      { id: "dtf24", src: media24, title: "DTF PRINTS" },
      { id: "dtf25", src: media25, title: "DTF PRINTS" },
      { id: "dtf26", src: media26, title: "DTF PRINTS" },
      { id: "dtf27", src: media27, title: "DTF PRINTS" },
      { id: "dtf28", src: media28, title: "DTF PRINTS" },
      { id: "dtf29", src: media29, title: "DTF PRINTS" },
      { id: "dtf30", src: media30, title: "DTF PRINTS" },
      { id: "dtf31", src: media31, title: "DTF PRINTS" },
      { id: "dtf32", src: media32, title: "DTF PRINTS" },
      { id: "dtf33", src: media33, title: "DTF PRINTS" },
      { id: "dtf34", src: media34, title: "DTF PRINTS" },
     { id: "dtf35", src: media35, title: "DTF PRINTS" },
      { id: "dtf36", src: media36, title: "DTF PRINTS" },
      { id: "dtf37", src: media37, title: "DTF PRINTS" },
       { id: "dtf38", src: media38, title: "DTF PRINTS" },
      { id: "dtf39", src: media39, title: "DTF PRINTS" },
      { id: "dtf40", src: media40, title: "DTF PRINTS" },
      { id: "dtf41", src: media41, title: "DTF PRINTS" },
      { id: "dtf42", src: media42, title: "DTF PRINTS" },
      { id: "dtf43", src: media43, title: "DTF PRINTS" },
      { id: "dtf44", src: media44, title: "DTF PRINTS" },
      { id: "dtf45", src: media45, title: "DTF PRINTS" },
      { id: "dtf46", src: media46, title: "DTF PRINTS" },
      { id: "dtf47", src: media47, title: "DTF PRINTS" },
      { id: "dtf48", src: media48, title: "DTF PRINTS" },
      { id: "dtf49", src: media49, title: "DTF PRINTS" },
      { id: "dtf50", src: media50, title: "DTF PRINTS" },
      { id: "dtf51", src: media51, title: "DTF PRINTS" },
  ],
  birthday: [
    { id: "bd1", src:media3, title: "Birthday" },
  ],
  pride: [
    { id: "pr1", src: media3, title: "Pride" },
  ],
  reactions: [
    { id: "rx1", src: media3, title: "Wow" },
  ],
  favourites: [
    { id: "fv1", src: media3, title: "Fav" },
  ],
};
