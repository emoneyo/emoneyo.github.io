import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Check, X, Upload, Camera } from 'lucide-react';

interface AvatarCropperProps {
  initialImage?: string;
  onCropComplete: (dataUrl: string) => void;
  onCancel: () => void;
  title?: string;
}

export const AvatarCropper: React.FC<AvatarCropperProps> = ({
  initialImage,
  onCropComplete,
  onCancel,
  title = 'प्रोफ़ाइल फोटो सेट करें (WhatsApp स्टाइल)',
}) => {
  const [imageSrc, setImageSrc] = useState<string>(initialImage || '');
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load image object whenever source changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setPosition({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      drawPreview();
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Redraw preview whenever zoom, rotation, or position changes
  useEffect(() => {
    drawPreview();
  }, [zoom, rotation, position]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('कृपया 5MB से छोटी फ़ाइल चुनें।');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawPreview = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Save context
    ctx.save();

    // Circular clipping mask
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Fill background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, size, size);

    // Transform: move to center, rotate, scale, then draw centered
    ctx.translate(size / 2 + position.x, size / 2 + position.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Maintain aspect ratio
    const aspect = img.width / img.height;
    let drawW = size;
    let drawH = size;
    if (aspect > 1) {
      drawW = size * aspect;
    } else {
      drawH = size / aspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();

    // Draw circular guideline ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2563eb';
    ctx.stroke();
    ctx.restore();
  };

  // Touch & Mouse drag handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSaveCrop = () => {
    if (!canvasRef.current || !imageRef.current) {
      if (imageSrc) {
        onCropComplete(imageSrc);
      }
      return;
    }
    const croppedDataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
    onCropComplete(croppedDataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm sm:text-base leading-snug">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="p-4 flex flex-col items-center">
          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-64 h-64 border-2 border-dashed border-blue-400 rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 transition-all text-center p-4 bg-slate-50"
            >
              <Upload className="w-10 h-10 text-blue-600 mb-2 animate-bounce" />
              <p className="font-bold text-sm text-slate-700">फोटो चुनें या क्लिक करें</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG (अधिकतम 5MB)</p>
              <button
                type="button"
                className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                गैलरी से अपलोड करें
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-xs text-slate-500 mb-2 font-medium">
                👆 फोटो को उंगली या माउस से घुमाकर व ज़ूम करके सेट करें
              </p>
              <div
                className="relative w-64 h-64 rounded-full overflow-hidden shadow-inner cursor-grab active:cursor-grabbing border-2 border-blue-500 bg-slate-100 touch-none flex items-center justify-center"
                onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
                onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={handlePointerUp}
              >
                <canvas ref={canvasRef} className="w-full h-full object-contain" />
              </div>

              {/* Controls */}
              <div className="w-full mt-4 space-y-3">
                {/* Zoom control */}
                <div className="flex items-center gap-3">
                  <ZoomOut className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <ZoomIn className="w-4 h-4 text-slate-500 shrink-0" />
                </div>

                {/* Actions: Rotate & Change photo */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    90° घुमाएं
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-300 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    दूसरी फोटो
                  </button>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Footer Buttons */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            रद्द करें
          </button>
          <button
            type="button"
            disabled={!imageSrc}
            onClick={handleSaveCrop}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/30 transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            फोटो सेट करें
          </button>
        </div>
      </div>
    </div>
  );
};
