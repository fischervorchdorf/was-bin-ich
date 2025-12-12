import React, { useState } from 'react';
import { ArtifactAnalysis } from '../types';
import { ArrowLeft, Calendar, Target, TrendingUp, Users, Mail, FileDown, Quote, Sparkles, Award, Clock } from 'lucide-react';
import { generatePDF } from '../services/pdfService';
import { Timeline } from './Timeline';
import { RarityScore } from './RarityScore';
import { ModernComparisonView } from './ModernComparison';
import { SocialEconomicView } from './SocialEconomicView';
import { VisualAnalysisView } from './VisualAnalysisView';

interface ResultsViewProps {
    analysis: ArtifactAnalysis;
    images: File[];
    onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ analysis, images, onReset }) => {
    const imageUrls = images.map(img => URL.createObjectURL(img));
    const [activeStory, setActiveStory] = useState<'short' | 'long'>('short');

    const handleEmailShare = () => {
        const subject = `Was bin ich? - ${analysis.identity.name}`;
        const body = encodeURIComponent(`ARTEFAKT-ANALYSE\n\n${analysis.identity.name}\n\nMeine Geschichte:\n${analysis.story.narrative}\n\n---\nPowered by Heimatverein Vorchdorf`);
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
    };

    const handlePDFDownload = async () => {
        try {
            await generatePDF(analysis, images);
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.');
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <button onClick={onReset} className="flex items-center gap-2 text-gray-700 hover:text-museum-charcoal">
                    <ArrowLeft size={20} /><span className="font-semibold">Neues Artefakt</span>
                </button>
                <div className="flex gap-3">
                    <button onClick={handleEmailShare} className="flex items-center gap-2 px-4 py-2 bg-museum-charcoal text-white rounded-lg hover:bg-museum-charcoal/90">
                        <Mail size={18} /><span className="hidden sm:inline">Per E-Mail</span>
                    </button>
                    <button onClick={handlePDFDownload} className="flex items-center gap-2 px-4 py-2 bg-museum-gold text-white rounded-lg hover:bg-museum-gold/90">
                        <FileDown size={18} /><span className="hidden sm:inline">Als PDF</span>
                    </button>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageUrls.map((url, i) => (
                    <img key={i} src={url} alt={`Bild ${i + 1}`} className="w-full h-64 object-contain bg-gray-100 rounded-lg border-2 border-museum-stone/20" />
                ))}
            </div>

            {/* Identity */}
            <div className="mb-10 bg-white rounded-2xl shadow-lg border-2 border-museum-gold/30 overflow-hidden">
                <div className="bg-gradient-to-r from-museum-charcoal to-museum-stone text-white p-6">
                    <h2 className="text-3xl font-serif font-bold flex items-center gap-3"><Award className="text-museum-gold" size={32} />Wer oder was bin ich?</h2>
                </div>
                <div className="p-8">
                    <div className="inline-block px-4 py-2 bg-museum-gold/10 border border-museum-gold/30 rounded-full mb-4">
                        <span className="text-museum-charcoal font-bold text-sm uppercase">{analysis.identity.category}</span>
                    </div>
                    <h3 className="text-4xl font-serif font-bold text-museum-charcoal mb-6">{analysis.identity.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <Calendar className="text-museum-gold mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-700 font-semibold uppercase">Zeitraum</p>
                                <p className="text-museum-charcoal font-medium">{analysis.identity.timePeriod}</p>
                                <p className="text-sm text-gray-700">{analysis.identity.creationDate}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Target className="text-museum-gold mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-700 font-semibold uppercase">Ursprünglicher Zweck</p>
                                <p className="text-museum-charcoal font-medium">{analysis.identity.originalPurpose}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mystery Clues */}
            {analysis.story.deductions && analysis.story.deductions.length > 0 && (
                <div className="mb-10 bg-gradient-to-br from-amber-900/10 to-yellow-900/10 rounded-2xl shadow-lg border-2 border-amber-700/30">
                    <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white p-6">
                        <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                            🔍 Die Deduktion
                        </h2>
                        <p className="text-amber-100 text-sm mt-1">Wie ich zur Identifikation kam...</p>
                    </div>
                    <div className="p-8">
                        <div className="space-y-4">
                            {analysis.story.deductions.map((deduction, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-white/60 rounded-lg border-l-4 border-amber-700">
                                    <p className="text-museum-charcoal pt-2 leading-relaxed">{deduction}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Highlights */}
            {analysis.story.detailHighlights && analysis.story.detailHighlights.length > 0 && (
                <div className="mb-10 bg-white rounded-2xl shadow-lg border-2 border-museum-gold/20 p-8">
                    <h3 className="text-2xl font-serif font-bold text-museum-charcoal mb-6 flex items-center gap-3">
                        <Sparkles className="text-museum-gold" size={28} />
                        Besondere Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.story.detailHighlights.map((detail, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-museum-paper rounded-lg border border-museum-stone/20">
                                <span className="text-museum-gold text-2xl">✦</span>
                                <p className="text-museum-charcoal pt-1">{detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rarity Scores */}
            {analysis.rarityScores && <RarityScore scores={analysis.rarityScores} />}

            {/* Modern Comparison */}
            {analysis.modernComparison && (
                <ModernComparisonView
                    comparison={analysis.modernComparison}
                    historicalName={analysis.identity.name}
                />
            )}

            {/* Social & Economic Context */}
            <SocialEconomicView
                socialContext={analysis.socialContext}
                economicContext={analysis.economicContext}
            />

            {/* Visual Analysis - only for photos/paintings */}
            {analysis.visualAnalysis && (
                <VisualAnalysisView visualAnalysis={analysis.visualAnalysis} />
            )}

            {/* Wandel der Zeit */}
            <div className="mb-10 bg-white rounded-2xl shadow-lg border-2 border-museum-stone/20 overflow-hidden">
                <div className="bg-museum-stone text-white p-6">
                    <h2 className="text-2xl font-serif font-bold flex items-center gap-3"><Clock size={28} />Wandel der Zeit</h2>
                </div>
                <div className="p-8">
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 border border-green-300">
                            <TrendingUp size={18} /><span className="font-bold">Heute: {analysis.evolution.modernStatus}</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700 font-semibold uppercase mb-4">Historische Entwicklung</p>
                    {analysis.evolution.historicalChanges.map((change, i) => (
                        <div key={i} className="flex items-start gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-museum-gold/20 flex items-center justify-center">
                                <span className="text-museum-charcoal font-bold text-sm">{i + 1}</span>
                            </div>
                            <p className="text-museum-charcoal pt-1">{change}</p>
                        </div>
                    ))}
                    <div className="mt-6 flex items-start gap-3 p-4 bg-museum-paper rounded-lg border border-museum-stone/20">
                        <Users className="text-museum-gold mt-1" size={20} />
                        <div>
                            <p className="text-sm text-gray-700 font-semibold uppercase mb-2">K ulturelle Bedeutung</p>
                            <p className="text-museum-charcoal">{analysis.evolution.culturalSignificance}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline - AFTER Wandel der Zeit */}
            {analysis.timeline && <Timeline milestones={analysis.timeline} />}

            {/* Meine Geschichte */}
            <div className="mb-10 bg-gradient-to-br from-purple-900/10 to-indigo-900/10 rounded-2xl shadow-lg border-2 border-purple-700/30 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Quote className="text-purple-300" size={32} />
                        <h2 className="text-3xl md:text-4xl font-serif font-bold italic">Meine Geschichte</h2>
                    </div>
                </div>
                <div className="p-8 md:p-12">
                    {/* Story Toggle */}
                    {analysis.story.longNarrative && (
                        <div className="flex justify-center gap-3 mb-8">
                            <button
                                onClick={() => setActiveStory('short')}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeStory === 'short'
                                        ? 'bg-gradient-to-r from-purple-800 to-indigo-800 text-white shadow-lg transform scale-105'
                                        : 'bg-white text-purple-900 border-2 border-purple-300 hover:border-purple-500'
                                    }`}
                            >
                                📖 Meine Geschichte
                            </button>
                            <button
                                onClick={() => setActiveStory('long')}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeStory === 'long'
                                        ? 'bg-gradient-to-r from-purple-800 to-indigo-800 text-white shadow-lg transform scale-105'
                                        : 'bg-white text-purple-900 border-2 border-purple-300 hover:border-purple-500'
                                    }`}
                            >
                                📚 Zeitgeschichte
                            </button>
                        </div>
                    )}

                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-museum-charcoal mb-6 text-center">"{analysis.story.title}"</h3>

                    {/* Short Story */}
                    {activeStory === 'short' && (
                        <div className="pl-6 border-l-4 border-museum-gold">
                            <p className="text-museum-charcoal leading-relaxed text-lg whitespace-pre-line">{analysis.story.narrative}</p>
                        </div>
                    )}

                    {/* Long Story */}
                    {activeStory === 'long' && analysis.story.longNarrative && (
                        <div className="pl-6 border-l-4 border-purple-500">
                            <p className="text-museum-charcoal leading-relaxed text-lg whitespace-pre-line">{analysis.story.longNarrative}</p>
                        </div>
                    )}

                    {/* keyMoments removed - was duplicate */}

                    {/* Story Summary */}
                    {analysis.story.summary && (
                        <div className="mt-8 p-6 bg-gradient-to-br from-museum-gold/10 to-amber-100/10 rounded-xl border-2 border-museum-gold/40">
                            <p className="text-sm text-gray-700 font-semibold uppercase mb-3 flex items-center gap-2">
                                <span className="text-museum-gold text-xl">✨</span> Fazit
                            </p>
                            <p className="text-museum-charcoal leading-relaxed italic">{analysis.story.summary}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center py-6 border-t border-museum-stone/20">
                <p className="text-gray-700 text-sm">Powered by <span className="font-semibold text-museum-charcoal">Heimatverein Vorchdorf</span></p>
            </div>
        </div>
    );
};
