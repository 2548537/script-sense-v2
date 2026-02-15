from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class QuestionPaper(db.Model):
    """Question paper model"""
    __tablename__ = 'question_papers'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    total_questions = db.Column(db.Integer, default=0)
    
    # Relationships
    marks = db.relationship('Mark', backref='question_paper', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'file_path': self.file_path,
            'uploaded_at': self.uploaded_at.isoformat(),
            'total_questions': self.total_questions
        }


class AnswerSheet(db.Model):
    """Answer sheet model"""
    __tablename__ = 'answer_sheets'
    
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(200), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    question_paper_id = db.Column(db.Integer, db.ForeignKey('question_papers.id'), nullable=True)
    remarks = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='pending')  # pending, evaluated
    
    # Relationships
    marks = db.relationship('Mark', backref='answer_sheet', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_name': self.student_name,
            'file_path': self.file_path,
            'uploaded_at': self.uploaded_at.isoformat(),
            'question_paper_id': self.question_paper_id,
            'remarks': self.remarks,
            'status': self.status
        }


class EvaluationRubric(db.Model):
    """Evaluation rubric model"""
    __tablename__ = 'evaluation_rubrics'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    rubric_data = db.Column(db.Text, nullable=True)  # JSON string for structured data
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'file_path': self.file_path,
            'uploaded_at': self.uploaded_at.isoformat(),
            'rubric_data': self.rubric_data
        }


class Mark(db.Model):
    """Mark model for storing question-wise marks"""
    __tablename__ = 'marks'
    
    id = db.Column(db.Integer, primary_key=True)
    answer_sheet_id = db.Column(db.Integer, db.ForeignKey('answer_sheets.id'), nullable=False)
    question_paper_id = db.Column(db.Integer, db.ForeignKey('question_papers.id'), nullable=True)
    question_number = db.Column(db.Integer, nullable=False)
    marks_awarded = db.Column(db.Float, nullable=False)
    max_marks = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint to prevent duplicate marks for same question
    __table_args__ = (
        db.UniqueConstraint('answer_sheet_id', 'question_number', name='unique_answer_question'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'answer_sheet_id': self.answer_sheet_id,
            'question_paper_id': self.question_paper_id,
            'question_number': self.question_number,
            'marks_awarded': self.marks_awarded,
            'max_marks': self.max_marks,
            'created_at': self.created_at.isoformat()
        }
