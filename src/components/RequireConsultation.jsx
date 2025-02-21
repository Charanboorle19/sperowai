import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireConsultation = ({ children }) => {
  const navigate = useNavigate();
  const { consultation_id } = useParams();
  const medicalRecord = useSelector(state => state.medicalRecord);

  useEffect(() => {
    if (!consultation_id || !medicalRecord.consultation_id) {
      navigate('/ai');
      return;
    }

    if (consultation_id !== medicalRecord.consultation_id) {
      navigate('/ai');
    }
  }, [consultation_id, medicalRecord.consultation_id, navigate]);

  return children;
};

export default RequireConsultation; 