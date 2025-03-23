import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const Feedback = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [comment, setComment] = useState('');
  const [hasIssues, setHasIssues] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState('');
  const [noRecommendReason, setNoRecommendReason] = useState('');
  const [improvements, setImprovements] = useState('');
  const [usefulFeatures, setUsefulFeatures] = useState({
    aiSummarization: false,
    aiSearch: false,
    aiBot: false,
  });

  // Initialize EmailJS with the first public key
  emailjs.init('elgvtY90Z5dDHMaFF'); // First public key

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!doctorName || !rating || !hasIssues || !wouldRecommend) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);

    // Convert star rating to star icons
    const ratingText = '⭐'.repeat(rating);

    // Convert radio button values to readable format
    const issuesText = hasIssues === 'yes' ? 'Yes' : 'No';
    const recommendationText = wouldRecommend === 'yes' ? 'Yes' : 'No';

    // Prepare the email template parameters for the first email
    const templateParams = {
      to_email: 'boorlesuryacharan.21.it@anits.edu.in', // First email
      doctor_name: `Dr. ${doctorName}`,
      rating: ratingText,
      comments: comment || 'No comments provided',
      useful_features: Object.entries(usefulFeatures)
        .filter(([_, checked]) => checked)
        .map(([feature]) => feature)
        .join(', ') || 'None selected',
      has_issues: issuesText,
      issues_description: issueDescription || 'No issues described',
      would_recommend: recommendationText,
      no_recommend_reason: noRecommendReason || 'No reason provided',
      improvements: improvements || 'No suggestions provided',
    };

    console.log('Template Params for First Email:', templateParams);

    try {
      console.log('Sending email to first address...');
      const response = await emailjs.send(
        'service_v2it6bg', // First service ID
        'template_ux1p8mw', // First template ID
        templateParams
      );
      console.log('First email sent successfully:', response);

      alert('Thank you for your feedback!');
      if (onClose) onClose(); // Close the feedback modal if `onClose` is provided
    } catch (error) {
      console.error('EmailJS Error:', error);
      console.error('Error Details:', {
        message: error.message,
        status: error.status,
        text: error.text,
      });
      alert(`Failed to send feedback: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Doctor's Name */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Dr. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="Please enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Overall Experience */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Overall Experience</h2>

          <div className="space-y-2">
            <label className="block text-gray-700">
              How satisfied are you with the platform? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    type="button"
                    key={ratingValue}
                    className={`text-2xl transition-colors duration-200 ${
                      ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <FaStar />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Tell us what you liked or what can be improved <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Share your experience..."
            />
          </div>
        </div>

        {/* Useful Features */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Usefulness & Features</h2>
          <div className="space-y-2">
            <label className="block text-gray-700 mb-2">
              Which features do you find most useful? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {Object.entries({
                aiSummarization: 'AI Summarization',
                aiSearch: 'AI Search',
                aiBot: 'AI Bot',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={usefulFeatures[key]}
                    onChange={(e) =>
                      setUsefulFeatures({
                        ...usefulFeatures,
                        [key]: e.target.checked,
                      })
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Issues & Improvements */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Issues & Improvements</h2>

          <div className="space-y-2">
            <label className="block text-gray-700">
              Did you face any issues while using the platform? <span className="text-red-500">*</span>
            </label>
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="yes"
                  checked={hasIssues === 'yes'}
                  onChange={(e) => setHasIssues(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="no"
                  checked={hasIssues === 'no'}
                  onChange={(e) => setHasIssues(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          {hasIssues === 'yes' && (
            <div>
              <label className="block text-gray-700 mb-2">
                Please describe the issues you encountered <span className="text-red-500">*</span>
              </label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Describe the issues..."
                required={hasIssues === 'yes'}
              />
            </div>
          )}
        </div>

        {/* Recommendation */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Recommendation</h2>

          <div className="space-y-2">
            <label className="block text-gray-700">
              Would you recommend this platform to other doctors? <span className="text-red-500">*</span>
            </label>
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="yes"
                  checked={wouldRecommend === 'yes'}
                  onChange={(e) => setWouldRecommend(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="no"
                  checked={wouldRecommend === 'no'}
                  onChange={(e) => setWouldRecommend(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          {wouldRecommend === 'no' && (
            <div>
              <label className="block text-gray-700 mb-2">
                Could you please explain why? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={noRecommendReason}
                onChange={(e) => setNoRecommendReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Please explain..."
                required={wouldRecommend === 'no'}
              />
            </div>
          )}
        </div>

        {/* Can we make any improvements? */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Can we make any improvements?</h2>
          <div>
            <label className="block text-gray-700 mb-2">
              Your suggestions for improvements <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Share your suggestions..."
            />
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <span className="text-red-500">*</span> Required fields
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.02] ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default Feedback;