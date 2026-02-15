import React, { useEffect, useMemo, useState } from "react";

export default function BulkOrder() {
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(0);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const basePrices = {
    tshirt: 349,
    hoodie: 499,
    cap: 199,
  };

  const productLabel = {
    tshirt: "T-Shirt",
    hoodie: "Hoodie",
    cap: "Cap / Accessories",
  };

  const getDiscount = (qty) => {
    if (qty >= 500) return 0.4;  // 40%
    if (qty >= 300) return 0.3;  // 30%
    if (qty >= 100) return 0.2;  // 20%
    if (qty >= 50) return 0.1;   // 10%
    if (qty >= 30) return 0.05;  // 5%
    return 0;
  };

  const discount = useMemo(() => getDiscount(quantity || 0), [quantity]);

  const basePrice = useMemo(() => {
    if (!product) return 0;
    return basePrices[product] || 0;
  }, [product]);

  const unitPrice = useMemo(() => {
    if (!product || !quantity) return 0;
    return Math.round(basePrice * (1 - discount));
  }, [product, quantity, basePrice, discount]);

  const totalPrice = useMemo(() => {
    if (!product || !quantity) return 0;
    return unitPrice * quantity;
  }, [product, quantity, unitPrice]);

  const canCalculate = Boolean(product) && quantity > 0;
  const canSubmit =
    name.trim() &&
    email.trim() &&
    product &&
    quantity > 0 &&
    images.length > 0;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // prevent memory leaks from objectURL (optional improvement)
  useEffect(() => {
    return () => {
      images.forEach((file) => URL.revokeObjectURL(file));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-wider text-gray-300">
              Bulk custom printing
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-2 leading-tight">
              Bulk Custom Orders — Simple, Clear & Fast
            </h1>
            <p className="text-gray-300 mt-4 text-base md:text-lg">
              Select a product, enter quantity, upload your design(s), and get instant bulk pricing.
              Perfect for colleges, companies, events, teams and organizations.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#bulk-form"
                className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
              >
                Start Bulk Order
              </a>
              <div className="px-5 py-3 rounded-full bg-white/10 border border-white/15 text-sm">
                ✅ Multiple designs allowed • ✅ Discounted pricing • ✅ Support included
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            How Bulk Ordering Works
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Choose Product", desc: "T-shirt, Hoodie or Cap." },
              { step: "2", title: "Enter Quantity", desc: "Discount applies automatically." },
              { step: "3", title: "Upload Designs", desc: "Upload one or multiple files." },
              { step: "4", title: "Submit Request", desc: "We confirm & start production." },
            ].map((x) => (
              <div key={x.step} className="bg-white border rounded-2xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  {x.step}
                </div>
                <h3 className="font-semibold text-lg mt-3">{x.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{x.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCOUNT TIERS */}
      <section className="bg-white py-12 px-6 border-y">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Bulk Discounts
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { qty: "30 – 49", discount: "5% OFF" },
              { qty: "50 – 99", discount: "10% OFF" },
              { qty: "100 – 299", discount: "20% OFF" },
              { qty: "300 – 499", discount: "30% OFF" },
            ].map((tier, index) => (
              <div
                key={index}
                className="border rounded-2xl p-6 text-center hover:border-black transition"
              >
                <h3 className="text-2xl font-extrabold mb-2">{tier.discount}</h3>
                <p className="text-gray-600">Order Quantity</p>
                <p className="font-semibold mt-2">{tier.qty}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            For <span className="font-semibold">500+</span> quantity — custom pricing available (best rate).
          </p>
        </div>
      </section>

      {/* FORM + SUMMARY */}
      <section id="bulk-form" className="py-14 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_380px] gap-6 items-start">
          {/* FORM */}
          <div className="bg-white border rounded-3xl shadow-sm p-6 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Request a Bulk Order</h2>
              <p className="text-sm text-gray-600 mt-2">
                Fill details below. You will get confirmation on email/WhatsApp (as per your contact).
              </p>
            </div>

            <form className="grid md:grid-cols-2 gap-5">
              {/* Step 1: contact */}
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Step 1 — Contact Details
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Company / Institution (optional)
                </label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  type="text"
                  placeholder="College / Company / Team"
                  className="mt-2 w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@email.com"
                  className="mt-2 w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Step 2: product */}
              <div className="md:col-span-2 pt-3">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Step 2 — Product & Quantity
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Select Product</label>
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="mt-2 w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Choose…</option>
                  <option value="tshirt">T-Shirt</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="cap">Cap / Accessories</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Quantity</label>
                <input
                  value={quantity || ""}
                  onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  className="mt-2 w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Discount starts from 30 qty.
                </p>
              </div>

              {/* Step 3: upload */}
              <div className="md:col-span-2 pt-3">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Step 3 — Upload Your Designs
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="border-2 border-dashed rounded-2xl p-6 text-center hover:border-black transition cursor-pointer bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="designUpload"
                  />
                  <label htmlFor="designUpload" className="cursor-pointer">
                    <p className="text-gray-700 font-semibold">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG / JPG / SVG — multiple files allowed
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Tip: Upload front/back design separately if needed.
                    </p>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-800">
                        Uploaded ({images.length})
                      </p>
                      <button
                        type="button"
                        onClick={() => setImages([])}
                        className="text-sm font-semibold text-red-600 hover:underline"
                      >
                        Remove all
                      </button>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                      {images.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="design"
                            className="h-24 w-full object-cover rounded-xl border bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-black text-white rounded-full w-7 h-7 text-xs"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: notes */}
              <div className="md:col-span-2 pt-3">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Step 4 — Special Instructions
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Notes (sizes, colors, placement, deadline, etc.)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Example: 30 pcs Black (M/L), 20 pcs White (S/M), front logo + back name…"
                  className="mt-2 w-full border p-3 rounded-xl h-32 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <button
                type="button"
                disabled={!canSubmit}
                className={[
                  "md:col-span-2 py-4 rounded-full font-semibold transition",
                  canSubmit
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed",
                ].join(" ")}
                onClick={() => {
                  // here you can send to backend / email service / whatsapp api
                  alert("Bulk order submitted! (Connect API here)");
                }}
              >
                Submit Bulk Order Request
              </button>

              {!canSubmit && (
                <p className="md:col-span-2 text-xs text-gray-500 text-center">
                  To submit: enter <b>Name</b>, <b>Email</b>, select <b>Product</b>, <b>Quantity</b>,
                  and upload at least <b>1 design</b>.
                </p>
              )}
            </form>
          </div>

          {/* SUMMARY (Sticky) */}
          <aside className="lg:sticky lg:top-6">
            <div className="bg-white border rounded-3xl shadow-sm p-6">
              <h3 className="text-lg font-bold">Order Summary</h3>
              <p className="text-sm text-gray-600 mt-1">
                Pricing updates instantly based on product and quantity.
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Product</span>
                  <span className="font-semibold">
                    {product ? productLabel[product] : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-semibold">{quantity || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Design Files</span>
                  <span className="font-semibold">{images.length}</span>
                </div>

                <div className="h-px bg-gray-200 my-2" />

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Base Price / piece</span>
                  <span className="font-semibold">
                    {product ? `₹${basePrice}` : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold">
                    {canCalculate ? `${Math.round(discount * 100)}%` : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Final / piece</span>
                  <span className="font-semibold">
                    {canCalculate ? `₹${unitPrice}` : "—"}
                  </span>
                </div>

                <div className="h-px bg-gray-200 my-2" />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-extrabold">
                    {canCalculate ? `₹${totalPrice}` : "—"}
                  </span>
                </div>

                {quantity >= 500 && (
                  <div className="mt-3 text-xs bg-gray-50 border rounded-xl p-3 text-gray-700">
                    For 500+ quantity, we can give the <b>best possible rate</b>.
                    Submit request — our team will contact you.
                  </div>
                )}
              </div>

              <div className="mt-6 bg-gray-50 border rounded-2xl p-4">
                <p className="text-sm font-semibold text-gray-900">What happens next?</p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1 list-disc pl-5">
                  <li>We review your designs and requirements.</li>
                  <li>We confirm sizes, colors and print placement.</li>
                  <li>We share final quotation + timeline.</li>
                  <li>Production starts after approval.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
