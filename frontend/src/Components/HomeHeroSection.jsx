import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Boxes, Palette, ShoppingBag, Sparkles } from "lucide-react";
import { customizeTemplateApi } from "../api/customizeTemplate.api";
import { productApi } from "../api/product.api";

const ACCESSORY_TYPES = new Set(["cap", "mug", "pen", "accessory"]);

const CARD_THEME = {
  shop: "from-slate-950 via-slate-900 to-slate-800 text-white",
  custom: "from-cyan-100 via-sky-50 to-white text-slate-900",
  accessories: "from-amber-100 via-orange-50 to-white text-slate-900",
  bulk: "from-emerald-100 via-teal-50 to-white text-slate-900",
};

export default function HomeHeroCarousel() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    products: 0,
    custom: 0,
    accessories: 0,
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const [productsRes, templatesRes] = await Promise.all([
          productApi.list({ page: 1, limit: 1, active: true }),
          customizeTemplateApi.list(),
        ]);

        if (!mounted) return;

        const templates = templatesRes?.data?.templates || [];
        const activeTemplates = templates.filter((t) => t?.isActive !== false);
        const accessoryCount = activeTemplates.filter((t) =>
          ACCESSORY_TYPES.has(String(t?.type || "").toLowerCase())
        ).length;

        setCounts({
          products: Number(productsRes?.data?.total || 0),
          accessories: accessoryCount,
          custom: activeTemplates.length - accessoryCount,
        });
      } catch (err) {
        if (!mounted) return;
        setCounts({ products: 0, custom: 0, accessories: 0 });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(
    () => [
      {
        id: "shop",
        title: "Shop Now",
        subtitle: "Ready products for instant order",
        countLabel: `${counts.products} items`,
        to: "/shop",
        icon: ShoppingBag,
        cta: "Browse products",
      },
      {
        id: "custom",
        title: "Customization",
        subtitle: "Design T-shirts and hoodies",
        countLabel: `${counts.custom} templates`,
        to: "/custom-tshirts",
        icon: Sparkles,
        cta: "Start designing",
      },
      {
        id: "accessories",
        title: "Customize Accessories",
        subtitle: "Mugs, caps, pen and more",
        countLabel: `${counts.accessories} templates`,
        to: "/custom-accessories",
        icon: Palette,
        cta: "Create accessory",
      },
      {
        id: "bulk",
        title: "Bulk Orders",
        subtitle: "Corporate and event quantity pricing",
        countLabel: "Get custom quote",
        to: "/bulk-order",
        icon: Boxes,
        cta: "Request quote",
      },
    ],
    [counts]
  );

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-5 md:pb-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 md:text-2xl">Explore Services</h2>
            <p className="mt-1 text-sm text-slate-600">
              Shop instantly or launch custom orders in a few clicks.
            </p>
          </div>
          {loading ? (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Updating data...
            </span>
          ) : null}
        </div>

        <div className="grid grid-flow-col auto-cols-[85%] gap-4 overflow-x-auto pb-2 [scrollbar-width:none] sm:auto-cols-[65%] lg:grid-flow-row lg:grid-cols-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                to={card.to}
                className={`group relative min-h-[190px] overflow-hidden rounded-3xl bg-gradient-to-br p-5 shadow-[0_12px_32px_rgba(2,6,23,0.08)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(2,6,23,0.14)] ${CARD_THEME[card.id]}`}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
                        <Icon className="h-3.5 w-3.5" />
                        Service
                      </span>
                      <span className="text-xs font-bold opacity-85">{card.countLabel}</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-black leading-tight">{card.title}</h3>
                    <p className="mt-2 text-sm opacity-90">{card.subtitle}</p>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                    {card.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
