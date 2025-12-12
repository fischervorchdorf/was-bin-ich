import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { ClarificationNeeds } from '../types';

interface ClarificationModalProps {
    clarification: ClarificationNeeds;
    onOptionSelected: (option: string) => void;
    onCancel: () => void;
}

export const ClarificationModal: React.FC<ClarificationModalProps> = ({
    clarification,
    onOptionSelected,
    onCancel
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-museum-paper rounded-2xl shadow-2xl max-w-2xl w-full border-4 border-museum-gold">
                {/* Header */}
                <div className="bg-museum-charcoal text-white p-6 flex items-center justify-between border-b-4 border-museum-gold">
                    <div className="flex items-center gap-3">
                        <HelpCircle size={28} className="text-museum-gold" />
                        <h2 className="text-2xl font-serif font-bold">Ich benötige deine Hilfe</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <p className="text-lg text-museum-charcoal mb-6 leading-relaxed">
                        {clarification.question}
                    </p>

                    <div className="space-y-3">
                        {clarification.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => onOptionSelected(option)}
                                className="w-full p-4 text-left border-2 border-museum-stone/30 rounded-xl hover:border-museum-gold hover:bg-museum-gold/5 transition-all group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-museum-gold/20 flex items-center justify-center group-hover:bg-museum-gold/40 transition-colors">
                                        <span className="font-bold text-museum-charcoal">{index + 1}</span>
                                    </div>
                                    <span className="text-museum-charcoal font-medium">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <p className="mt-6 text-sm text-museum-stone text-center">
                        💡 Wähle die passendste Option, damit ich dir eine genauere Geschichte erzählen kann
                    </p>
                </div>
            </div>
        </div>
    );
};
