import React from 'react';
import { RarityScores } from '../types';

interface RarityScoreProps {
    scores: RarityScores;
}

const ScoreBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
    const getColorClass = (val: number) => {
        if (val >= 8) return 'bg-green-500';
        if (val >= 5) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700 uppercase">{label}</span>
                <span className="text-lg font-bold text-museum-charcoal">{value}/10</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full ${getColorClass(value)} transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: `${(value / 10) * 100}%` }}
                />
            </div>
        </div>
    );
};

export const RarityScore: React.FC<RarityScoreProps> = ({ scores }) => {
    if (!scores) return null;

    return (
        <div className="mb-10 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg border-2 border-museum-gold/30 p-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-museum-charcoal mb-6 flex items-center gap-3">
                ⭐ Bewertung
            </h2>

            <div className="space-y-6">
                <ScoreBar label="Seltenheit" value={scores.rarity} />
                <ScoreBar label="Erhaltung" value={scores.condition} />
                <ScoreBar label="Historischer Wert" value={scores.historicalValue} />

                {/* Overall Score */}
                <div className="mt-8 p-6 bg-gradient-to-r from-museum-gold/20 to-amber-400/20 rounded-xl border-2 border-museum-gold/50">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-museum-charcoal uppercase">Gesamtwert</span>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-museum-gold">{scores.overall.toFixed(1)}</span>
                            <span className="text-xl text-gray-600">/10</span>
                            <div className="flex gap-1 ml-2">
                                {[...Array(Math.floor(scores.overall / 2))].map((_, i) => (
                                    <span key={i} className="text-2xl">🌟</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
