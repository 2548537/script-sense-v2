import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Save, Eye, FileText } from 'lucide-react';
import PDFViewer from '../components/PDFViewer';
import TranscriptionPanel from '../components/TranscriptionPanel';
import GradingPanel from '../components/GradingPanel';
import DocumentModal from '../components/DocumentModal';
import { getFiles, getPdfInfo } from '../services/api';

const EvaluationPage = () => {
    const { answersheetId } = useParams();
    const navigate = useNavigate();

    const [answerSheet, setAnswerSheet] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [transcription, setTranscription] = useState(null);
    const [showQuestionPaper, setShowQuestionPaper] = useState(false);
    const [showRubric, setShowRubric] = useState(false);
    const [questionPapers, setQuestionPapers] = useState([]);
    const [rubrics, setRubrics] = useState([]);

    useEffect(() => {
        loadAnswerSheet();
        loadQuestionPapersAndRubrics();
    }, [answersheetId]);

    const loadAnswerSheet = async () => {
        try {
            const filesData = await getFiles('answer');
            const sheet = filesData.files.find(f => f.id === parseInt(answersheetId));
            setAnswerSheet(sheet);

            const pdfInfo = await getPdfInfo(answersheetId);
            setTotalPages(pdfInfo.page_count);
        } catch (error) {
            console.error('Failed to load answer sheet:', error);
        }
    };

    const loadQuestionPapersAndRubrics = async () => {
        try {
            const qpData = await getFiles('question');
            const rubricData = await getFiles('rubric');
            setQuestionPapers(qpData.files || []);
            setRubrics(rubricData.files || []);
        } catch (error) {
            console.error('Failed to load documents:', error);
        }
    };

    const handleRegionSelect = (region) => {
        setSelectedRegion(region);
    };

    const handlePageChange = (direction) => {
        if (direction === 'next' && currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
            setSelectedRegion(null);
            setTranscription(null);
        } else if (direction === 'prev' && currentPage > 0) {
            setCurrentPage(currentPage - 1);
            setSelectedRegion(null);
            setTranscription(null);
        }
    };

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <header className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-ghost p-3"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold gradient-text">
                            Evaluating: {answerSheet?.student_name || 'Loading...'}
                        </h1>
                        <p className="text-gray-400">
                            Page {currentPage + 1} of {totalPages}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange('prev')}
                        disabled={currentPage === 0}
                        className="btn btn-ghost p-3"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handlePageChange('next')}
                        disabled={currentPage >= totalPages - 1}
                        className="btn btn-ghost p-3"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content - 3 Column Layout */}
            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
                {/* Left Panel - PDF Viewer */}
                <div className="col-span-3">
                    <PDFViewer
                        answersheetId={answersheetId}
                        currentPage={currentPage}
                        onPageSelect={setCurrentPage}
                        onRegionSelect={handleRegionSelect}
                    />
                </div>

                {/* Center Panel - Transcription */}
                <div className="col-span-6">
                    <TranscriptionPanel
                        answersheetId={answersheetId}
                        page={currentPage}
                        region={selectedRegion}
                        onTranscriptionComplete={setTranscription}
                    />
                </div>

                {/* Right Panel - Grading */}
                <div className="col-span-3">
                    <GradingPanel
                        answersheetId={answersheetId}
                        answerSheet={answerSheet}
                        questionPapers={questionPapers}
                        rubrics={rubrics}
                        onViewQuestionPaper={() => setShowQuestionPaper(true)}
                        onViewRubric={() => setShowRubric(true)}
                    />
                </div>
            </div>

            {/* Modals */}
            {showQuestionPaper && questionPapers.length > 0 && (
                <DocumentModal
                    file={questionPapers[0]}
                    onClose={() => setShowQuestionPaper(false)}
                    title="Question Paper"
                />
            )}

            {showRubric && rubrics.length > 0 && (
                <DocumentModal
                    file={rubrics[0]}
                    onClose={() => setShowRubric(false)}
                    title="Evaluation Rubric"
                />
            )}
        </div>
    );
};

export default EvaluationPage;
