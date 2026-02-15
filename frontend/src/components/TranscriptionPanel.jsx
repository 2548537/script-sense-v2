import React, { useState, useEffect } from 'react';
import { Sparkles, FileImage, Loader } from 'lucide-react';
import { transcribeRegion } from '../services/api';

const TranscriptionPanel = ({ answersheetId, page, region, onTranscriptionComplete }) => {
    const [transcription, setTranscription] = useState('');
    const [diagramInfo, setDiagramInfo] = useState(null);
    const [extractedImage, setExtractedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (region && answersheetId) {
            performOCR();
        }
    }, [region, answersheetId, page]);

    const performOCR = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await transcribeRegion(answersheetId, page, region);

            if (result.success) {
                setTranscription(result.transcription);
                setDiagramInfo(result.diagram_info);
                setExtractedImage(result.image);
                onTranscriptionComplete?.(result.transcription);
            } else {
                setError('Failed to transcribe region');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during transcription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-strong h-full rounded-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white border-opacity-10">
                <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-400" />
                    Transcription & Analysis
                </h3>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                {loading && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Loader className="w-12 h-12 text-primary-400 animate-spin mb-4" />
                        <p className="text-gray-400">Transcribing handwriting with Gemini AI...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {!loading && !error && !transcription && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Sparkles className="w-16 h-16 text-gray-500 mb-4" />
                        <h4 className="text-xl font-semibold mb-2">Select a Region</h4>
                        <p className="text-gray-400">
                            Click and drag on the PDF to select a region for transcription
                        </p>
                    </div>
                )}

                {transcription && (
                    <div className="space-y-6">
                        {/* Transcribed Text */}
                        <div>
                            <h4 className="font-semibold text-lg mb-3 text-primary-400">
                                Transcribed Text
                            </h4>
                            <div className="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
                                <p className="whitespace-pre-wrap leading-relaxed">{transcription}</p>
                            </div>
                        </div>

                        {/* Diagram Info */}
                        {diagramInfo?.has_diagram && (
                            <div>
                                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-accent-400">
                                    <FileImage className="w-5 h-5" />
                                    Diagram Detected
                                </h4>
                                <div className="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
                                    <p className="text-sm text-gray-300 mb-3">{diagramInfo.description}</p>
                                    {extractedImage && (
                                        <img
                                            src={extractedImage}
                                            alt="Extracted region"
                                            className="rounded-lg border border-white border-opacity-20 max-w-full"
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Show extracted region even if no diagram */}
                        {!diagramInfo?.has_diagram && extractedImage && (
                            <div>
                                <h4 className="font-semibold text-lg mb-3">Selected Region</h4>
                                <img
                                    src={extractedImage}
                                    alt="Extracted region"
                                    className="rounded-lg border border-white border-opacity-20 max-w-full"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TranscriptionPanel;
