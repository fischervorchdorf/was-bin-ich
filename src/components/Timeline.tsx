import React from 'react';
import { TimelineMilestone } from '../types';

interface TimelineProps {
    milestones: TimelineMilestone[];
}

export const Timeline: React.FC<TimelineProps> = ({ milestones }) => {
    if (!milestones || milestones.length === 0) return null;

    return (
        <div className="mb-10 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-2xl shadow-lg border-2 border-blue-700/30 p-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-museum-charcoal mb-8 flex items-center gap-3">
                ⏳ Zeitreise
            </h2>

            {/* Timeline Container */}
            <div className="relative">
                {/* Horizontal Line */}
                <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 rounded-full" />

                {/* Milestones */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
                    {milestones.map((milestone, i) => (
                        <div key={i} className="flex flex-col items-center">
                            {/* Icon Circle */}
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-800 to-indigo-800 flex items-center justify-center text-4xl shadow-lg border-4 border-white relative z-10 hover:scale-110 transition-transform">
                                {milestone.icon}
                            </div>

                            {/* Year */}
                            <div className="mt-4 text-center">
                                <p className="text-lg font-bold text-blue-900">{milestone.year}</p>
                                <p className="text-sm font-semibold text-museum-charcoal mt-1">{milestone.label}</p>
                                <p className="text-xs text-gray-600 mt-1 max-w-[120px]">{milestone.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile: Vertical Timeline */}
            <div className="md:hidden mt-8 space-y-6">
                {milestones.map((milestone, i) => (
                    <div key={i} className="flex items-start gap-4 bg-white/60 p-4 rounded-lg border-l-4 border-blue-700">
                        <div className="text-4xl flex-shrink-0">{milestone.icon}</div>
                        <div>
                            <p className="font-bold text-blue-900">{milestone.year}</p>
                            <p className="font-semibold text-museum-charcoal">{milestone.label}</p>
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
