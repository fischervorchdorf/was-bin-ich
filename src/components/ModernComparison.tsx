import React from 'react';
import { ModernComparison } from '../types';

interface ModernComparisonProps {
    comparison: ModernComparison;
    historicalName: string;
}

export const ModernComparisonView: React.FC<ModernComparisonProps> = ({ comparison, historicalName }) => {
    if (!comparison || !comparison.comparisons || comparison.comparisons.length === 0) return null;

    return (
        <div className="mb-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-purple-300/40 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white p-6 text-center">
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Damals vs. Heute</h2>
                <p className="text-purple-100 text-sm">Wie hat sich die Welt verändert?</p>
            </div>

            <div className="p-8">
                {/* Header */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                        <div className="bg-amber-100 border-2 border-amber-700 rounded-lg p-4">
                            <p className="font-bold text-amber-900 text-lg">{historicalName}</p>
                            <p className="text-xs text-amber-700 mt-1">Historisch</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            VS
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="bg-blue-100 border-2 border-blue-700 rounded-lg p-4">
                            <p className="font-bold text-blue-900 text-lg">{comparison.modernName}</p>
                            <p className="text-xs text-blue-700 mt-1">Modern</p>
                        </div>
                    </div>
                </div>

                {/* Comparisons */}
                <div className="space-y-4">
                    {comparison.comparisons.map((comp, i) => (
                        <div key={i} className="bg-white/80 rounded-xl border border-purple-200 overflow-hidden">
                            <div className="bg-purple-100 px-4 py-2 border-b border-purple-200">
                                <p className="font-semibold text-purple-900 flex items-center gap-2">
                                    <span className="text-xl">{comp.icon}</span>
                                    {comp.category}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-purple-200">
                                <div className="p-4 bg-amber-50/50">
                                    <p className="text-museum-charcoal">{comp.historical}</p>
                                </div>
                                <div className="p-4 bg-blue-50/50">
                                    <p className="text-museum-charcoal">{comp.modern}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
