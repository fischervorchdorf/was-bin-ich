import React from 'react';
import { VisualAnalysis } from '../types';
import { Eye, AlertTriangle, ArrowRight, Info, Image as ImageIcon } from 'lucide-react';

interface VisualAnalysisViewProps {
    visualAnalysis: VisualAnalysis;
}

export const VisualAnalysisView: React.FC<VisualAnalysisViewProps> = ({ visualAnalysis }) => {
    if (!visualAnalysis) return null;

    return (
        <div className="mb-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-purple-600/30 p-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-museum-charcoal mb-6 flex items-center gap-3">
                <Eye className="text-purple-600" size={32} />
                Bildanalyse & Kontext
            </h2>

            <div className="space-y-6">
                {/* Composition */}
                {visualAnalysis.composition && (
                    <div className="bg-white/60 rounded-xl p-6 border border-purple-200">
                        <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                            <ImageIcon size={20} />
                            Komposition & Technik
                        </h3>
                        <p className="text-museum-charcoal leading-relaxed">
                            {visualAnalysis.composition}
                        </p>
                    </div>
                )}

                {/* Clothing & Background */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {visualAnalysis.clothing && (
                        <div className="bg-white/60 rounded-xl p-6 border border-purple-200">
                            <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                                👔 Kleidung & Status
                            </h3>
                            <p className="text-museum-charcoal">
                                {visualAnalysis.clothing}
                            </p>
                        </div>
                    )}

                    {visualAnalysis.background && (
                        <div className="bg-white/60 rounded-xl p-6 border border-purple-200">
                            <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                                🏛️ Hintergrund & Umgebung
                            </h3>
                            <p className="text-museum-charcoal">
                                {visualAnalysis.background}
                            </p>
                        </div>
                    )}
                </div>

                {/* Invisible Context */}
                {visualAnalysis.invisibleContext && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-400/50">
                        <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-amber-600" size={22} />
                            Der unsichtbare Kontext
                        </h3>

                        <div className="space-y-4">
                            {visualAnalysis.invisibleContext.missing && (
                                <div>
                                    <p className="text-xs font-semibold text-amber-700 uppercase mb-1">
                                        ❌ Was fehlt im Bild?
                                    </p>
                                    <p className="text-gray-800">
                                        {visualAnalysis.invisibleContext.missing}
                                    </p>
                                </div>
                            )}

                            {visualAnalysis.invisibleContext.creator && (
                                <div>
                                    <p className="text-xs font-semibold text-amber-700 uppercase mb-1">
                                        📷 Wer stand hinter der Kamera/dem Pinsel?
                                    </p>
                                    <p className="text-gray-800">
                                        {visualAnalysis.invisibleContext.creator}
                                    </p>
                                </div>
                            )}

                            {visualAnalysis.invisibleContext.purpose && (
                                <div>
                                    <p className="text-xs font-semibold text-amber-700 uppercase mb-1">
                                        🎯 Zweck des Bildes
                                    </p>
                                    <p className="text-gray-800">
                                        {visualAnalysis.invisibleContext.purpose}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Representation Change over Time */}
                {visualAnalysis.representationChange && (
                    <div className="bg-white/60 rounded-xl p-6 border-2 border-purple-300">
                        <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                            <ArrowRight className="text-purple-600" size={20} />
                            Darstellungswandel im Zeitkontext
                        </h3>
                        <p className="text-museum-charcoal italic leading-relaxed">
                            {visualAnalysis.representationChange}
                        </p>
                    </div>
                )}

                {/* Info Note */}
                <div className="flex items-start gap-3 p-4 bg-purple-100/50 rounded-lg border border-purple-300">
                    <Info className="text-purple-700 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-gray-700 italic">
                        Diese Analyse basiert auf visuellen Elementen und historischem Kontext des Bildes.
                    </p>
                </div>
            </div>
        </div>
    );
};
