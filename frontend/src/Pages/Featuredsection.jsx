import React from "react";
import { ArrowRight } from "lucide-react";
import megaSaleImg from "../assets/megasale.png";
import personImg from "../assets/person.png";
import dealImg from "../assets/men.png";

const FeaturedSection = () => {
  return (
    <section className="w-full  py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mega Sale Banner */}
        <div
          className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-sm min-h-[220px] flex items-end"
          style={{
            backgroundImage: `url(${megaSaleImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
          <div className="relative p-6 text-white w-full">
            <p className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold backdrop-blur">
              Limited Time Offer
            </p>
            <h3 className="mt-3 text-2xl font-extrabold leading-tight">
              Mega Sale on Custom Prints
            </h3>
            <p className="mt-1 text-sm text-white/85">
              Best prices on T-Shirts & DTF prints. Start designing today.
            </p>

            <button
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-[#0B4CCB] hover:bg-white/90 transition"
              onClick={() => (window.location.href = "/createdesign")}
            >
              Start Designing <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Review Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex gap-4 items-start">
            <img
              src={personImg}
              alt="Customer"
              className="w-14 h-14 rounded-2xl object-cover border border-gray-200"
            />

            <div className="flex-1">
              <div className="flex mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">
                      ★
                    </span>
                  ))}
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                Great quality and super easy to customize. The print looks premium and delivery was fast!
              </p>

              <p className="text-sm font-extrabold mt-3 text-gray-900">
                – Rohit S.
              </p>

              <div className="mt-4 rounded-2xl bg-[#F5F8FF] border border-[#0B4CCB]/15 p-4">
                <p className="text-xs font-extrabold text-[#0B4CCB] tracking-wide">
                  TRUSTED BY CUSTOMERS
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  4.8/5 average rating for custom orders.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deals */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs font-extrabold text-[#0B4CCB] tracking-wide">
                OFFERS
              </p>
              <h3 className="text-xl font-extrabold text-gray-900">
                Popular Deals
              </h3>
            </div>

            <button
              className="text-sm font-extrabold text-[#0B4CCB] hover:underline"
              onClick={() => (window.location.href = "/featureproduct")}
            >
              View All
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-gray-200">
            <img
              src={dealImg}
              alt="Deal"
              className="w-full h-44 object-cover"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
              <div className="text-white">
                <p className="text-sm font-extrabold">Deal of the Day</p>
                <p className="text-xs text-white/85">Extra discount on selected items</p>
              </div>

              <button
                className="shrink-0 rounded-xl bg-[#0B4CCB] text-white text-xs font-extrabold px-4 py-2 hover:bg-[#083CA2] transition"
                onClick={() => (window.location.href = "/featureproduct")}
              >
                Grab Deal
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
