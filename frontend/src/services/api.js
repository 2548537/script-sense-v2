import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ||
    (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : `${window.location.origin}/api`);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Upload services
export const uploadQuestionPaper = async (file, title, totalQuestions) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('total_questions', totalQuestions);

    const response = await api.post('/upload/question-paper', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const uploadAnswerSheet = async (file, studentName, questionPaperId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('student_name', studentName);
    if (questionPaperId) formData.append('question_paper_id', questionPaperId);

    const response = await api.post('/upload/answer-sheet', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const uploadRubric = async (file, title) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    const response = await api.post('/upload/rubric', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getFiles = async (type = 'all') => {
    const response = await api.get(`/upload/files?type=${type}`);
    return response.data;
};

export const getFileUrl = (fileId, type) => {
    return `${API_BASE_URL}/upload/files/${fileId}/view?type=${type}`;
};

export const getThumbnailUrl = (fileId, type) => {
    return `${API_BASE_URL}/upload/files/${fileId}/thumbnail?type=${type}`;
};

// Evaluation services
export const transcribeRegion = async (answersheetId, page, coordinates) => {
    const response = await api.post('/evaluate/transcribe', {
        answersheetId,
        page,
        coordinates
    });
    return response.data;
};

export const extractDiagram = async (answersheetId, page, coordinates) => {
    const response = await api.post('/evaluate/extract-diagram', {
        answersheetId,
        page,
        coordinates
    });
    return response.data;
};

export const saveMarks = async (answersheetId, questionPaperId, questionNumber, marksAwarded, maxMarks) => {
    const response = await api.post('/evaluate/marks', {
        answersheetId,
        questionPaperId,
        questionNumber,
        marksAwarded,
        maxMarks
    });
    return response.data;
};

export const getMarks = async (answersheetId) => {
    const response = await api.get(`/evaluate/marks/${answersheetId}`);
    return response.data;
};

export const getTotalMarks = async (answersheetId) => {
    const response = await api.get(`/evaluate/marks/${answersheetId}/total`);
    return response.data;
};

export const getPdfInfo = async (answersheetId) => {
    const response = await api.get(`/evaluate/pdf-info/${answersheetId}`);
    return response.data;
};

export const saveReport = async (answersheetId, remarks) => {
    const response = await api.post('/evaluate/save-report', {
        answersheetId,
        remarks
    });
    return response.data;
};

export default api;
