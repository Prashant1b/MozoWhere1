import React from "react";

export default function BottomActions({
  mode = "edit",
  onAddText,
  onUpload,
  onOpenGallery,
  onSave,
  onNext,
}) {
  return (
    <div className="w-full border-t border-gray-200 bg-white">
      {mode === "edit" ? (
        <>
          <div className="grid grid-cols-3">
            <button
              onClick={onAddText}
              className="py-6 border-r border-gray-200 hover:bg-gray-50"
            >
              <div className="text-3xl font-black">Tt</div>
              <div className="text-sm">Add Text</div>
            </button>

            <button
              onClick={onUpload}
              className="py-6 border-r border-gray-200 hover:bg-gray-50"
            >
              <div className="text-3xl">📷</div>
              <div className="text-sm">Upload</div>
            </button>

            <button onClick={onOpenGallery} className="py-6 hover:bg-gray-50">
              <div className="text-3xl">🖼️</div>
              <div className="text-sm">Gallery</div>
            </button>
          </div>

          <div className="grid grid-cols-2">
            <button
              onClick={onSave}
              className="py-6 text-lg font-bold text-[#2a9d9d] border-t border-r border-gray-200 hover:bg-[#f4fbfb]"
            >
              SAVE
            </button>
            <button
              onClick={onNext}
              className="py-6 text-lg font-bold text-white bg-[#3DA3A3] border-t border-gray-200 hover:bg-[#338e8e]"
            >
              NEXT
            </button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2">
          <button className="py-6 text-lg font-semibold border-r border-gray-200 hover:bg-gray-50">
            Terms & Conditions
          </button>
          <button className="py-6 text-lg font-semibold hover:bg-gray-50">
            About This Product
          </button>
          <button className="col-span-2 py-7 text-xl font-bold text-white bg-[#3DA3A3] hover:bg-[#338e8e]">
            ADD TO BAG
          </button>
        </div>
      )}
    </div>
  );
}
