import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Eye, Pencil } from 'lucide-react';
import { getThumbnailUrl } from '../services/api';

const FileGrid = ({ files, onRefresh }) => {
    const navigate = useNavigate();

    const handleEvaluate = (file) => {
        navigate(`/evaluate/${file.id}`);
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'question_paper': return 'from-blue-500 to-blue-600';
            case 'answer_sheet': return 'from-green-500 to-green-600';
            case 'rubric': return 'from-purple-500 to-purple-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'question_paper': return 'Question Paper';
            case 'answer_sheet': return 'Answer Sheet';
            case 'rubric': return 'Rubric';
            default: return 'File';
        }
    };

    if (!files || files.length === 0) {
        return (
            <div className="glass p-12 rounded-xl text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <p className="text-xl text-gray-400">No files uploaded yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((file) => (
                <div
                    key={`${file.type}-${file.id}`}
                    className="glass card-hover group relative overflow-hidden rounded-xl"
                >
                    {/* Thumbnail */}
                    <div className="aspect-[3/4] bg-gray-800 relative overflow-hidden">
                        <img
                            src={getThumbnailUrl(file.id, file.type.replace('_sheet', '').replace('_paper', ''))}
                            alt={file.title || file.student_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280"><rect fill="%23374151" width="200" height="280"/><text x="50%" y="50%" text-anchor="middle" fill="%239CA3AF" font-size="24">PDF</text></svg>';
                            }}
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                            <button className="btn btn-ghost p-3">
                                <Eye className="w-5 h-5" />
                            </button>
                            {file.type === 'answer_sheet' && (
                                <button
                                    onClick={() => handleEvaluate(file)}
                                    className="btn btn-primary p-3"
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* File info */}
                    <div className="p-4">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTypeColor(file.type)} mb-2`}>
                            {getTypeLabel(file.type)}
                        </div>
                        <h4 className="font-semibold text-lg mb-1 truncate">
                            {file.student_name || file.title}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {new Date(file.uploaded_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FileGrid;
