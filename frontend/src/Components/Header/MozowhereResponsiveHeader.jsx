import React, { useMemo, useState } from "react";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

export default function MozowhereResponsiveHeader({
  mobileShopIn,
  setMobileShopIn,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userName = "User";

  const menuLinks = useMemo(
    () => [
      { label: "SHOP NOW", to: "/shop" },
      { label: "CUSTOMIZE", to: "/custom-tshirts" },
       { label: "CUSTOMIZE ACCESSORIES", to: "/custom-tshirts" },
      { label: "BULK ORDER", to: "/bulk-order" },
      { label: "DESIGN WITH PRINTS", to: "/customizer" },
      { label: "ACCESSORIES", to: "/accessories" },
    ],
    []
  );

  return (
    <header className="w-full bg-white">
      <DesktopHeader
        menuLinks={menuLinks}
        mobileShopIn={mobileShopIn}
        setMobileShopIn={setMobileShopIn}
      />

      <MobileHeader
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        mobileShopIn={mobileShopIn}
        setMobileShopIn={setMobileShopIn}
        userName={userName}
      />
    </header>
  );
}
