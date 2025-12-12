import { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { LoadingState } from './components/LoadingState';
import { ClarificationModal } from './components/ClarificationModal';
import { ResultsView } from './components/ResultsView';
import { analyzeArtifact } from './services/geminiService';
import { AppState, ArtifactAnalysis } from './types';
import { AlertCircle } from 'lucide-react';

function App() {
    const [appState, setAppState] = useState<AppState>(AppState.IDLE);
    const [images, setImages] = useState<File[]>([]);
    const [analysis, setAnalysis] = useState<ArtifactAnalysis | null>(null);
    const [error, setError] = useState<string>('');
    const [fromAustria, setFromAustria] = useState<boolean>(false);
    const [isPhotography, setIsPhotography] = useState<boolean>(false);
    const [isPainting, setIsPainting] = useState<boolean>(false);
    const [originLocation, setOriginLocation] = useState<string>('');
    const [makerOrUse, setMakerOrUse] = useState<string>('');


    const handleImagesSelected = async (selectedImages: File[]) => {
        setImages(selectedImages);
        await performAnalysis(selectedImages, '');
    };

    const performAnalysis = async (imagesToAnalyze: File[], context: string) => {
        setError('');
        setAppState(AppState.ANALYZING);

        // Build context from structured fields
        const locationInfo = originLocation ? `Herstellungsort: ${originLocation}` : '';
        const makerInfo = makerOrUse ? `Hersteller/Verwendung: ${makerOrUse}` : '';
        const combinedInfo = [locationInfo, makerInfo].filter(Boolean).join('. ');

        try {
            const result = await analyzeArtifact(
                imagesToAnalyze,
                context,
                fromAustria,
                combinedInfo,
                isPhotography,
                isPainting
            );
            setAnalysis(result);

            // Check if clarification is needed
            if (result.needsClarification) {
                setAppState(AppState.CLARIFICATION);
            } else {
                setAppState(AppState.RESULTS);
            }
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Die Analyse konnte nicht durchgeführt werden. Bitte versuchen Sie es erneut."
            );
            setAppState(AppState.ERROR);
        }
    };

    const handleClarificationOption = async (option: string) => {
        const context = `Der Benutzer hat gewählt: ${option}`;
        await performAnalysis(images, context);
    };

    const handleClarificationCancel = () => {
        setAppState(AppState.IDLE);
        setImages([]);
        setAnalysis(null);
    };

    const handleReset = () => {
        setImages([]);
        setAnalysis(null);
        setError('');
        setAppState(AppState.IDLE);
    };

    return (
        <div className="min-h-screen bg-museum-paper flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto max-w-7xl py-8">

                {/* IDLE State - Upload */}
                {appState === AppState.IDLE && (
                    <div className="fade-in">
                        <div className="max-w-3xl mx-auto text-center py-12 px-4">
                            <div className="inline-block px-4 py-2 border border-museum-gold/30 rounded-full bg-amber-50/50 mb-4">
                                <p className="text-museum-sage text-sm opacity-80 pl-4 border-l border-museum-sage/30">
                                    Ein KI-Experiment des Heimatvereins Vorchdorf (v5.1)
                                </p>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-serif text-museum-charcoal leading-tight mb-4">
                                Jedes Objekt <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-600 italic font-bold">
                                    hat eine Geschichte
                                </span>
                            </h2>
                            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                Lade ein Bild deines Artefakts hoch und erfahre seine spannende Geschichte –
                                erzählt aus seiner eigenen Perspektive im Stil von Sherlock Holmes.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Image Upload First */}
                            <ImageUpload onImagesSelected={handleImagesSelected} />

                            {/* Media Type Selection - 3 checkboxes in one row */}
                            <div className="bg-white rounded-lg border-2 border-museum-stone/20 hover:border-museum-gold/50 transition-colors p-4">
                                <p className="text-sm font-semibold text-gray-700 mb-3">Art des Uploads</p>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={fromAustria}
                                            onChange={(e) => setFromAustria(e.target.checked)}
                                            className="w-4 h-4 text-museum-gold rounded focus:ring-museum-gold"
                                        />
                                        <span className="text-museum-charcoal font-medium text-sm">🇦🇹 Aus Österreich</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isPhotography}
                                            onChange={(e) => setIsPhotography(e.target.checked)}
                                            className="w-4 h-4 text-museum-gold rounded focus:ring-museum-gold"
                                        />
                                        <span className="text-museum-charcoal font-medium text-sm">📷 Fotografie</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isPainting}
                                            onChange={(e) => setIsPainting(e.target.checked)}
                                            className="w-4 h-4 text-museum-gold rounded focus:ring-museum-gold"
                                        />
                                        <span className="text-museum-charcoal font-medium text-sm">🎨 Gemälde</span>
                                    </label>
                                </div>
                            </div>

                            {/* Structured Info Fields - AFTER media type */}
                            <div className="bg-white rounded-lg border-2 border-museum-stone/20 hover:border-museum-gold/50 transition-colors p-4">
                                <p className="text-sm font-semibold text-gray-700 mb-4">Zusätzliche Informationen (optional)</p>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            Herstellungsort
                                        </label>
                                        <input
                                            type="text"
                                            value={originLocation}
                                            onChange={(e) => setOriginLocation(e.target.value)}
                                            className="w-full px-3 py-2 border border-museum-stone/30 rounded-lg focus:ring-2 focus:ring-museum-gold focus:border-transparent text-sm"
                                            placeholder="z.B. Vorchdorf, Wien, Salzburg..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            Hersteller / Verwendung
                                        </label>
                                        <input
                                            type="text"
                                            value={makerOrUse}
                                            onChange={(e) => setMakerOrUse(e.target.value)}
                                            className="w-full px-3 py-2 border border-museum-stone/30 rounded-lg focus:ring-2 focus:ring-museum-gold focus:border-transparent text-sm"
                                            placeholder="z.B. Krumhuber, Werkstatt Schmidt..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ANALYZING State */}
                {appState === AppState.ANALYZING && (
                    <LoadingState />
                )}

                {/* CLARIFICATION State */}
                {appState === AppState.CLARIFICATION && analysis?.needsClarification && (
                    <ClarificationModal
                        clarification={analysis.needsClarification}
                        onOptionSelected={handleClarificationOption}
                        onCancel={handleClarificationCancel}
                    />
                )}

                {/* RESULTS State */}
                {appState === AppState.RESULTS && analysis && (
                    <ResultsView
                        analysis={analysis}
                        images={images}
                        onReset={handleReset}
                    />
                )}

                {/* ERROR State */}
                {appState === AppState.ERROR && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-red-50 p-6 rounded-full mb-4 border-4 border-red-200">
                            <AlertCircle size={48} className="text-red-600" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-museum-charcoal mb-2">
                            Ein Fehler ist aufgetreten
                        </h3>
                        <p className="text-museum-stone max-w-md mb-8">{error}</p>
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 bg-museum-charcoal text-white rounded-lg hover:bg-museum-charcoal/90 transition-colors font-semibold"
                        >
                            Erneut versuchen
                        </button>
                    </div>
                )}

            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-museum-stone/20 py-6 mt-auto">
                <div className="container mx-auto text-center">
                    <p className="text-sm text-gray-700">
                        &copy; {new Date().getFullYear()} Was bin ich? • Powered by{' '}
                        <span className="font-semibold text-museum-charcoal">Heimatverein Vorchdorf</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                        KI-gestützte Artefakt-Analyse mit historischem Storytelling
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default App;
