import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import apiService from '../services/api/apiService';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      localStorage.removeItem('jwt_token');
      const response = await apiService.login(formData);
      if (response) {
        localStorage.setItem('jwt_token', response.access_token);
        const username = formData.email.split('@')[0];
        localStorage.setItem('username', username);
        localStorage.setItem('user_email', formData.email);
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = (e) => {
    e.preventDefault();
    setIsRequestLoading(true);
    setTimeout(() => {
      setRequestSent(true);
      setIsRequestLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Block - Login */}
      <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center order-2 md:order-1">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center gap-3 mb-12">
            <img src={Logo} alt="Sperow" className="w-8 h-8" />
            <span className="text-3xl font-bold text-[#3973EB]">Sperow</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600 mb-8">Please enter your details to sign in</p>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <DotLottieReact
                src="https://lottie.host/a24e256f-5659-4b97-80ee-b47c8a96ca6b/D9Cnk21FTV.lottie"
                loop
                autoplay
                style={{ width: '150px', height: '150px' }}
              />
              <p className="mt-4 text-gray-600">Signing in...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#3973EB] text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                Sign in
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Right Block - Professional Signup */}
      <div className="w-full md:w-1/2 bg-[#3973EB] p-8 flex flex-col justify-center text-white order-1 md:order-2">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold mb-4">
            Join Our AI-Powered Healthcare Platform
          </h2>
          <p className="text-blue-100 mb-8">
            Exclusively for healthcare professionals. Transform your workflow with cutting-edge AI technology.
          </p>

          {requestSent ? (
            <div className="bg-blue-600/50 p-6 rounded-xl text-center">
              <p className="text-white text-lg mb-4">Request has been sent please wait to confirm</p>
              <DotLottieReact
                src="https://lottie.host/ad9c421b-201a-4d0b-bdcd-d9521635e796/6cDY3LRDr4.lottie"
                loop
                autoplay
                style={{ width: '150px', height: '150px', margin: '0 auto' }}
              />
            </div>
          ) : (
            <form onSubmit={handleRequestAccess} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  Professional Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-blue-400 bg-blue-600/50 text-white placeholder-blue-200 focus:ring-2 focus:ring-white/20 focus:border-white outline-none transition-all"
                  placeholder="Enter your professional email"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-[#3973EB] py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                disabled={isRequestLoading}
              >
                {isRequestLoading ? (
                  <DotLottieReact
                    src="https://lottie.host/ad9c421b-201a-4d0b-bdcd-d9521635e796/6cDY3LRDr4.lottie"
                    loop
                    autoplay
                    style={{ width: '24px', height: '24px', margin: '0 auto' }}
                  />
                ) : (
                  'Request Access'
                )}
              </button>

              <p className="text-sm text-blue-200 text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;