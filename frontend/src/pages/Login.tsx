import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import useAuthStore from '../context/authStore';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { validateEmail } from '../utils/validation';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error: any) {
      setErrors({ general: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Racing Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Racing stripes */}
          <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-f1-500 via-motogp-500 to-lemans-500 opacity-30 transform -skew-y-12"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-lemans-500 via-accent-neon to-f1-500 opacity-30 transform skew-y-12"></div>
          <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-motogp-500 via-accent-purple to-lemans-500 opacity-30 transform -skew-y-12"></div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-f1-500/10 to-transparent rounded-full blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-motogp-500/10 to-transparent rounded-full blur-xl animate-bounce-slow"></div>
        </div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center">
            <div className="relative mx-auto mb-6">
              <div className="w-20 h-20 bg-racing-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-f1-500/20 mx-auto">
                <span className="text-white font-bold text-2xl font-racing">SV</span>
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-racing-gradient rounded-2xl blur-xl opacity-50 mx-auto animate-pulse-slow"></div>
            </div>
            <h2 className="text-4xl font-bold font-racing mb-2">
              <span className="bg-gradient-to-r from-f1-500 via-accent-electric to-motogp-500 bg-clip-text text-transparent">
                Welcome to SportVerse
              </span>
            </h2>
            <p className="text-lg text-gray-300 font-sport mb-2">
              🏁 Ready to join the racing universe? 🏎️
            </p>
            <p className="text-sm text-gray-400">
              Sign in to access exclusive racing content and live updates
            </p>
          </div>

          {/* Login Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-f1-500/10 via-motogp-500/10 to-lemans-500/10 rounded-3xl blur-xl"></div>
            <Card className="relative bg-gradient-to-br from-dark-100/90 to-dark-200/90 backdrop-blur-lg border-gray-600/50 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-gradient-to-r from-f1-500/20 to-f1-600/20 border border-f1-500/50 rounded-xl p-4 shadow-neon-pink">
                    <p className="text-sm text-f1-300 font-sport">{errors.general}</p>
                  </div>
                )}

                {/* Demo Credentials Info */}
                <div className="bg-gradient-to-r from-accent-neon/10 to-accent-electric/10 border border-accent-neon/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-accent-neon to-accent-electric rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-white">!</span>
                    </div>
                    <span className="text-sm font-sport font-semibold text-accent-neon">Demo Credentials</span>
                  </div>
                  <div className="text-xs text-gray-300 font-sport space-y-1">
                    <div><strong>Email:</strong> test@sportverse.com</div>
                    <div><strong>Password:</strong> password123</div>
                  </div>
                </div>

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="Enter your email"
                leftIcon={<FiMail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                placeholder="Enter your password"
                leftIcon={<FiLock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-racing-gradient hover:shadow-neon transform hover:scale-[1.02] transition-all duration-300 font-sport font-bold text-lg py-4"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Entering the Race...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>🏁 Start Your Engines</span>
                  </div>
                )}
              </Button>
            </form>
          </Card>
        </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/50 to-transparent h-px top-1/2"></div>
              <div className="relative bg-dark-50 px-4">
                <span className="text-sm text-gray-400 font-sport">New to the racing world?</span>
              </div>
            </div>
            <Link
              to="/register"
              className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-transparent to-transparent hover:from-motogp-500/20 hover:to-lemans-500/20 border border-gray-600 hover:border-motogp-500/50 rounded-xl transition-all duration-300 font-sport font-medium text-gray-300 hover:text-white"
            >
              <span>🏎️ Join the Race</span>
              <div className="w-2 h-2 bg-motogp-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login; 