import React, { useState } from 'react';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiType, setApiType] = useState('cloudflare'); // Switch between APIs

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getApiUrl = () => {
    if (apiType === 'cloudflare') {
      return 'https://your-api.your-subdomain.workers.dev/contact';
    } else {
      // Vercel API route - will be at your-site.vercel.app/api/contact
      return '/api/contact';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus(`✅ Success! Processed at: ${result.data.processedAt}`);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setStatus('❌ Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>
      
      {/* API Switch for Testing */}
      <div className="mb-6 p-3 bg-gray-100 rounded-md">
        <p className="text-sm font-medium text-gray-700 mb-2">Testing API:</p>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="apiType"
              value="cloudflare"
              checked={apiType === 'cloudflare'}
              onChange={(e) => setApiType(e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">Cloudflare Workers</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="apiType"
              value="vercel"
              checked={apiType === 'vercel'}
              onChange={(e) => setApiType(e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">Vercel Functions</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {isLoading ? 'Sending...' : `Send via ${apiType === 'cloudflare' ? 'Cloudflare' : 'Vercel'}`}
        </button>
      </div>

      {status && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          status.includes('❌') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {status}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Current API: <strong>{apiType === 'cloudflare' ? 'Cloudflare Workers (Edge)' : 'Vercel Functions (Regional)'}</strong></p>
        <p>URL: <code className="bg-gray-100 px-1 rounded">{getApiUrl()}</code></p>
      </div>
    </div>
  );
};

export default App;