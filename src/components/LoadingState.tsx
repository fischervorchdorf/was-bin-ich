import React from 'react';

export const LoadingState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
            {/* Animated magnifying glass */}
            <div className="relative mb-8">
                <div className="w-24 h-24 relative">
                    <div className="absolute inset-0 border-4 border-museum-gold border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-museum-stone border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        🔍
                    </div>
                </div>
            </div>

            {/* Loading text */}
            <p className="text-2xl font-serif font-bold text-museum-charcoal mb-6">Entdeckungsreise läuft...</p>
            <p className="text-gray-700 mb-8">
                Die KI analysiert das Artefakt und erforscht seine Geschichte
            </p>

            <div className="flex flex-col items-center gap-3 text-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-museum-gold rounded-full animate-pulse"></div>
                    <span>Identifizierung</span>
                </div>
                <div className="w-8 h-0.5 bg-museum-stone/30"></div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-museum-stone/50 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    <span>Datierung</span>
                </div>
                <div className="w-8 h-0.5 bg-museum-stone/30"></div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-museum-stone/50 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                    <span>Geschichte</span>
                </div>
            </div>

            <p className="mt-8 text-xs text-museum-stone/70">
                ⏱️ Dies kann bis zu 30 Sekunden dauern
            </p>
        </div>
    );
};
