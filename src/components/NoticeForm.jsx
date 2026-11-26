import React, { useState } from 'react';
import { Save, Send, RotateCcw } from 'lucide-react';
import { CATEGORIES, DEPARTMENTS, PRIORITIES } from '../data/sampleData';
import { getTodayDateString } from '../utils/dateUtils';

const getDefaultExpiry = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function NoticeForm({ initialData, onSubmit, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    department: initialData?.department || DEPARTMENTS[0].id,
    category: initialData?.category || CATEGORIES[0],
    priority: initialData?.priority || 'Normal',
    expiryDate: initialData?.expiryDate || getDefaultExpiry(),
    postedBy: initialData?.postedBy || '',
    status: initialData?.status || 'Published',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const nextErrors = {};
    if (!data.title.trim()) {
      nextErrors.title = 'Notice title is required.';
    } else if (data.title.trim().length < 5) {
      nextErrors.title = 'Title must be at least 5 characters long.';
    }

    if (!data.department) {
      nextErrors.department = 'Please select a department.';
    }

    if (!data.category) {
      nextErrors.category = 'Please select a category.';
    }

    if (!data.postedBy.trim()) {
      nextErrors.postedBy = 'Issuer / Author name is required.';
    }

    if (!data.expiryDate) {
      nextErrors.expiryDate = 'Expiry date is required.';
    }

    if (!data.description.trim()) {
      nextErrors.description = 'Notice description is required.';
    } else if (data.description.trim().length < 15) {
      nextErrors.description = 'Please enter at least 15 characters for notice details.';
    }

    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const submitWithStatus = (targetStatus) => {
    const payload = {
      ...formData,
      title: formData.title.trim(),
      postedBy: formData.postedBy.trim(),
      description: formData.description.trim(),
      status: targetStatus || formData.status,
    };

    const validationErrors = validate(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(payload);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    submitWithStatus(formData.status);
  };

  const handleReset = () => {
    setFormData({
      title: '',
      department: DEPARTMENTS[0].id,
      category: CATEGORIES[0],
      priority: 'Normal',
      expiryDate: getDefaultExpiry(),
      postedBy: '',
      status: 'Published',
      description: '',
    });
    setErrors({});
  };

  return (
    <form className="surface-card form-card" onSubmit={handleFormSubmit} noValidate>
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="notice-title" className="form-label">
            Notice Title <span className="required-star">*</span>
          </label>
          <input
            id="notice-title"
            name="title"
            type="text"
            className={`form-control ${errors.title ? 'error' : ''}`}
            placeholder="e.g., Mid-Semester Practical Examination Schedule"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="notice-department" className="form-label">
            Department <span className="required-star">*</span>
          </label>
          <select
            id="notice-department"
            name="department"
            className={`form-control ${errors.department ? 'error' : ''}`}
            value={formData.department}
            onChange={handleChange}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.id} — {dept.name}
              </option>
            ))}
          </select>
          {errors.department && <span className="error-text">{errors.department}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="notice-category" className="form-label">
            Category <span className="required-star">*</span>
          </label>
          <select
            id="notice-category"
            name="category"
            className={`form-control ${errors.category ? 'error' : ''}`}
            value={formData.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="notice-priority" className="form-label">
            Priority Level <span className="required-star">*</span>
          </label>
          <select
            id="notice-priority"
            name="priority"
            className="form-control"
            value={formData.priority}
            onChange={handleChange}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notice-expiry" className="form-label">
            Expiry Date <span className="required-star">*</span>
          </label>
          <input
            id="notice-expiry"
            name="expiryDate"
            type="date"
            min={!isEditing ? getTodayDateString() : undefined}
            className={`form-control ${errors.expiryDate ? 'error' : ''}`}
            value={formData.expiryDate}
            onChange={handleChange}
          />
          {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="notice-postedBy" className="form-label">
            Issued By / Authority <span className="required-star">*</span>
          </label>
          <input
            id="notice-postedBy"
            name="postedBy"
            type="text"
            className={`form-control ${errors.postedBy ? 'error' : ''}`}
            placeholder="e.g., HOD CSE / Examination Cell"
            value={formData.postedBy}
            onChange={handleChange}
          />
          {errors.postedBy && <span className="error-text">{errors.postedBy}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="notice-status" className="form-label">
            Publication Status
          </label>
          <select
            id="notice-status"
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Published">Published (Visible to Students)</option>
            <option value="Draft">Draft (Admin Only)</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="notice-description" className="form-label">
            Detailed Notice Content <span className="required-star">*</span>
          </label>
          <textarea
            id="notice-description"
            name="description"
            rows={6}
            className={`form-control ${errors.description ? 'error' : ''}`}
            placeholder="Write complete instructions, dates, venue, eligibility criteria, or contact details..."
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>
      </div>

      <div className="form-footer">
        {!isEditing && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleReset}
            style={{ marginRight: 'auto' }}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        )}

        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => submitWithStatus('Draft')}
        >
          <Save size={16} />
          <span>Save as Draft</span>
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => submitWithStatus('Published')}
        >
          <Send size={16} />
          <span>{isEditing ? 'Update & Publish' : 'Publish Notice'}</span>
        </button>
      </div>
    </form>
  );
}
