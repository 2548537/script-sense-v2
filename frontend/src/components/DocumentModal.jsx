import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getFileUrl } from '../services/api';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const DocumentModal = ({ file, onClose, title }) => {
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const fileType = file.type.replace('_sheet', '').replace('_paper', '');
    const pdfUrl = getFileUrl(file.id, fileType);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="glass-strong max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-white border-opacity-10 flex items-center justify-between">
                    <h3 className="text-xl font-semibold gradient-text">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* PDF Content */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="flex flex-col items-center">
                        <Document
                            file={pdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={<div className="spinner mx-auto"></div>}
                            error={<div className="text-red-500">Failed to load PDF. Please try again.</div>}
                        >
                            <Page
                                pageNumber={currentPage}
                                width={Math.min(window.innerWidth - 200, 800)}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                            />
                        </Document>

                        {/* Page navigation */}
                        {numPages > 1 && (
                            <div className="mt-6 flex items-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="btn btn-ghost px-4 py-2"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-300">
                                    Page {currentPage} of {numPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                                    disabled={currentPage === numPages}
                                    className="btn btn-ghost px-4 py-2"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentModal;
