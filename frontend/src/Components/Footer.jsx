import React from "react";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-300 mt-20">

            {/* Top CTA Section */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                        Stay Updated with Mozowhere
                    </h2>
                    <p className="mt-3 text-gray-400 text-sm">
                        Subscribe for new drops, exclusive offers & custom design tips.
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3 w-full sm:w-96">
                            <Mail className="h-5 w-5 text-gray-400 mr-2" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-transparent outline-none text-sm flex-1 text-white placeholder-gray-500"
                            />
                        </div>

                        <button className="bg-[#FFD23D] text-gray-900 font-extrabold px-6 py-3 rounded-xl hover:opacity-90 transition">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Footer Grid */}
            <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

                {/* Brand Section */}
                <div>
                    <h3 className="text-2xl font-extrabold text-white">
                        MOZOWHERE<span className="text-[#FFD23D]">®</span>
                    </h3>

                    <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                        India's premium custom fashion brand. Design your own
                        T-Shirts, Hoodies & more with ease.
                    </p>

                    {/* Social */}
                    <div className="flex gap-4 mt-6">
                        <Facebook className="h-5 w-5 hover:text-[#FFD23D] cursor-pointer transition" />
                        <Instagram className="h-5 w-5 hover:text-[#FFD23D] cursor-pointer transition" />
                        <Twitter className="h-5 w-5 hover:text-[#FFD23D] cursor-pointer transition" />
                        <Youtube className="h-5 w-5 hover:text-[#FFD23D] cursor-pointer transition" />
                    </div>
                </div>

                {/* Shop Links */}
                <div>
                    <h4 className="text-white font-bold mb-4">Shop</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="hover:text-[#FFD23D] cursor-pointer">Men</li>
                        <li className="hover:text-[#FFD23D] cursor-pointer">Women</li>
                        <li className="hover:text-[#FFD23D] cursor-pointer">Hoodies</li>
                        <li className="hover:text-[#FFD23D] cursor-pointer">Customize</li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h4 className="text-white font-bold mb-4">Support</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="hover:text-[#FFD23D] cursor-pointer">Track Order</li>
                        <li className="hover:text-[#FFD23D] cursor-pointer">Returns</li>
                        <li className="hover:text-[#FFD23D] cursor-pointer">FAQ</li>
                        <li className="hover:text-[#FFD23D] cursor-pointer">Contact Us</li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-white font-bold mb-4">Contact</h4>

                    <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-[#FFD23D]" />
                            <span>+91 9123262970</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-[#FFD23D]" />
                            <span>mozowhere@gmail.com</span>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-[#FFD23D] mt-1" />
                            <span>
                                Name Of Building: Chuharpur Khadar<br />
                                Road: SECTOR CHI 5 ROAD<br />
                                Locality: Chuharpur Khadar<br />
                                City/Town/Village: Greater Noida<br />
                                District: Gautam buddha Naga
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">

                    <div>
                        © {new Date().getFullYear()} Mozowhere®. All rights reserved.
                    </div>

                    <div className="flex gap-6 mt-3 sm:mt-0">
                        <span className="hover:text-[#FFD23D] cursor-pointer">
                            Privacy Policy
                        </span>
                        <span className="hover:text-[#FFD23D] cursor-pointer">
                            Terms & Conditions
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
