import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
    onImagesSelected: (files: File[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesSelected }) => {
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const maxImages = 4;

    const handleFilesSelected = (files: FileList | null) => {
        if (!files) return;

        const fileArray = Array.from(files).slice(0, maxImages - images.length);
        const newImages = [...images, ...fileArray];

        // Create previews
        const newPreviews = fileArray.map(file => URL.createObjectURL(file));
        const allPreviews = [...previews, ...newPreviews];

        setImages(newImages);
        setPreviews(allPreviews);
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleAnalyze = () => {
        if (images.length > 0) {
            onImagesSelected(images);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4">

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={preview}
                                    alt={`Artefakt ${index + 1}`}
                                    className="w-full h-40 object-contain rounded-lg border-2 border-museum-stone/30"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    <X size={16} />
                                </button>
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-museum-charcoal/80 text-white text-xs rounded">
                                    Bild {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Section */}
            {images.length < maxImages && (
                <div className="border-2 border-dashed border-museum-stone/40 rounded-2xl p-8 md:p-12 bg-white shadow-sm hover:border-museum-gold/50 transition-colors">
                    <div className="text-center">
                        <div className="p-6 rounded-full bg-museum-gold/10 inline-block mb-6">
                            <Upload size={48} className="text-museum-gold" strokeWidth={1.5} />
                        </div>

                        <h3 className="text-2xl font-serif font-bold text-museum-charcoal mb-3">
                            {images.length === 0 ? 'Artefakt hochladen' : 'Weiteres Bild hinzufügen'}
                        </h3>
                        <p className="text-gray-700 mb-8 max-w-md mx-auto">
                            {images.length === 0
                                ? 'Lade 1-4 Bilder deines Artefakts hoch oder mache ein Foto'
                                : `Noch ${maxImages - images.length} Bild(er) möglich`}
                        </p>

                        {/* Upload Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                ref={fileInputRef}
                                onChange={(e) => handleFilesSelected(e.target.files)}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-museum-charcoal text-white rounded-lg hover:bg-museum-charcoal/90 transition-colors shadow-md font-semibold"
                            >
                                <ImageIcon size={20} />
                                <span>Galerie</span>
                            </button>

                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                multiple
                                className="hidden"
                                ref={cameraInputRef}
                                onChange={(e) => handleFilesSelected(e.target.files)}
                            />
                            <button
                                onClick={() => cameraInputRef.current?.click()}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-museum-gold text-white rounded-lg hover:bg-museum-gold/90 transition-colors shadow-md font-semibold"
                            >
                                <Camera size={20} />
                                <span>Foto aufnehmen</span>
                            </button>
                        </div>

                        <p className="mt-6 text-sm text-gray-600">
                            💡 Mehrere Perspektiven helfen bei der Identifizierung
                        </p>
                    </div>
                </div>
            )}

            {/* Analyze Button */}
            {images.length > 0 && (
                <div className="mt-8 text-center">
                    <button
                        onClick={handleAnalyze}
                        className="px-12 py-4 bg-gradient-to-r from-museum-charcoal via-museum-stone to-museum-gold text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl border-2 border-museum-gold"
                    >
                        🔍 Bilder analysieren
                    </button>
                    <p className="mt-3 text-sm text-gray-700">
                        {images.length} Bild(er) ausgewählt
                    </p>
                </div>
            )}
        </div>
    );
};
