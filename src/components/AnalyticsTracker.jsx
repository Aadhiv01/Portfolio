import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsTracker = () => {
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    uniqueVisitors: new Set(),
    bounceRate: 0,
    sessionDuration: 0,
    visitsByLocation: {},
    viewsOverTime: []
  });

  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    // Track page view
    const trackPageView = () => {
      setAnalytics(prev => ({
        ...prev,
        pageViews: prev.pageViews + 1,
        viewsOverTime: [...prev.viewsOverTime, {
          time: new Date().toLocaleTimeString(),
          views: prev.pageViews + 1
        }]
      }));
    };

    // Track unique visitors using client IP
    const trackVisitor = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const visitorIP = data.ip;

        setAnalytics(prev => ({
          ...prev,
          uniqueVisitors: new Set([...prev.uniqueVisitors, visitorIP])
        }));

        // Get location data
        const geoResponse = await fetch(`https://ipapi.co/${visitorIP}/json/`);
        const geoData = await geoResponse.json();
        
        setAnalytics(prev => ({
          ...prev,
          visitsByLocation: {
            ...prev.visitsByLocation,
            [geoData.country_name]: (prev.visitsByLocation[geoData.country_name] || 0) + 1
          }
        }));
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    // Track session duration
    setStartTime(new Date());
    const intervalId = setInterval(() => {
      if (startTime) {
        const duration = (new Date() - startTime) / 1000;
        setAnalytics(prev => ({
          ...prev,
          sessionDuration: duration
        }));
      }
    }, 1000);

    // Track bounce rate
    const trackBounce = () => {
      const timeOnPage = (new Date() - startTime) / 1000;
      if (timeOnPage < 30) { // Consider it a bounce if less than 30 seconds
        setAnalytics(prev => ({
          ...prev,
          bounceRate: (prev.bounceRate * (prev.pageViews - 1) + 100) / prev.pageViews
        }));
      }
    };

    window.addEventListener('beforeunload', trackBounce);
    trackPageView();
    trackVisitor();

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', trackBounce);
    };
  }, [startTime]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Real-time Analytics Dashboard">
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <h3 className="text-lg font-semibold">Page Views</h3>
              <p className="text-2xl">{analytics.pageViews}</p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg">
              <h3 className="text-lg font-semibold">Unique Visitors</h3>
              <p className="text-2xl">{analytics.uniqueVisitors.size}</p>
            </div>
            <div className="p-4 bg-yellow-100 rounded-lg">
              <h3 className="text-lg font-semibold">Bounce Rate</h3>
              <p className="text-2xl">{analytics.bounceRate.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-purple-100 rounded-lg">
              <h3 className="text-lg font-semibold">Session Duration</h3>
              <p className="text-2xl">{Math.floor(analytics.sessionDuration)}s</p>
            </div>
          </div>

          <div className="mt-8 h-64">
            <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.viewsOverTime}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Visits by Location</h3>
            <div className="space-y-2">
              {Object.entries(analytics.visitsByLocation).map(([country, visits]) => (
                <div key={country} className="flex justify-between items-center">
                  <span>{country}</span>
                  <span className="font-semibold">{visits} visits</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTracker;