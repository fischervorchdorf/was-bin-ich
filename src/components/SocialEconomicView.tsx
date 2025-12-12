import React from 'react';
import { SocialContext, EconomicContext } from '../types';
import { Users, TrendingUp, DollarSign, Info } from 'lucide-react';

interface SocialEconomicViewProps {
    socialContext?: SocialContext;
    economicContext?: EconomicContext;
}

export const SocialEconomicView: React.FC<SocialEconomicViewProps> = ({
    socialContext,
    economicContext
}) => {
    // Only render if we have data
    if (!socialContext && !economicContext) return null;

    return (
        <div className="mb-10 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-lg border-2 border-teal-600/30 p-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-museum-charcoal mb-6 flex items-center gap-3">
                <Users className="text-teal-600" size={32} />
                Soziale & Wirtschaftliche Dimension
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Social Context */}
                {socialContext && (
                    <div className="bg-white/60 rounded-xl p-6 border border-teal-200">
                        <h3 className="text-lg font-bold text-teal-800 mb-4 flex items-center gap-2">
                            <Users size={20} />
                            Soziale Aspekte
                        </h3>

                        {socialContext.genderRole && (
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                                    Geschlechterrollen
                                </p>
                                <p className="text-museum-charcoal">
                                    {socialContext.genderRole}
                                </p>
                            </div>
                        )}

                        {socialContext.socialClass && (
                            <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                                    Soziale Schicht
                                </p>
                                <p className="text-museum-charcoal">
                                    {socialContext.socialClass}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Economic Context */}
                {economicContext && (
                    <div className="bg-white/60 rounded-xl p-6 border border-teal-200">
                        <h3 className="text-lg font-bold text-teal-800 mb-4 flex items-center gap-2">
                            <DollarSign size={20} />
                            Wirtschaftliche Aspekte
                        </h3>

                        {economicContext.historicalPrice && (
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                                    Damaliger Preis
                                </p>
                                <p className="text-museum-charcoal font-medium">
                                    {economicContext.historicalPrice}
                                </p>
                            </div>
                        )}

                        {economicContext.modernEquivalent && (
                            <div className="flex items-start gap-2">
                                <TrendingUp className="text-teal-600 mt-1" size={16} />
                                <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                                        Heutige Kaufkraft
                                    </p>
                                    <p className="text-museum-charcoal font-medium">
                                        {economicContext.modernEquivalent}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Info Note */}
            <div className="mt-6 flex items-start gap-3 p-4 bg-teal-100/50 rounded-lg border border-teal-300">
                <Info className="text-teal-700 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-gray-700 italic">
                    Diese Informationen basieren auf historischen Dokumenten und allgemeinem Wissen der Zeit.
                </p>
            </div>
        </div>
    );
};
