import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Copy, Check, Inbox, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Email {
  id: string;
  from: string;
  subject: string;
  timestamp: string;
  content: string;
}

export function TempEmail() {
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateNewEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      // Generate a random string for the email
      const randomString = Math.random().toString(36).substring(2, 12);
      const newEmail = `${randomString}@temporary.net`;
      setEmailAddress(newEmail);
      setEmails([]);
    } catch (err) {
      setError('Failed to generate new email address');
    }
    setLoading(false);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    generateNewEmail();
  }, []);

  // Simulate receiving new emails
  useEffect(() => {
    if (!emailAddress) return;

    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.3) { // 30% chance to receive a new email
        const newEmail: Email = {
          id: Math.random().toString(),
          from: `service${Math.floor(Math.random() * 100)}@example.com`,
          subject: `Verification Code ${Math.floor(Math.random() * 1000000)}`,
          timestamp: new Date().toISOString(),
          content: `Your verification code is: ${Math.floor(Math.random() * 1000000)}`
        };
        setEmails(prev => [newEmail, ...prev]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [emailAddress]);

  return (
    <div className="w-full max-w-4xl mx-auto text-white">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Temporary Email</h2>
              <p className="text-gray-400">Receive emails and tokens securely</p>
            </div>
          </div>
          <button
            onClick={generateNewEmail}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>New Email</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Your temporary email address</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-mono">{emailAddress}</span>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-white/5 rounded-lg transition-all"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inbox */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold">Inbox</h3>
              </div>
              <span className="text-sm text-gray-400">{emails.length} messages</span>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {emails.map((email) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedEmail?.id === email.id
                        ? 'bg-blue-600/20 border border-blue-500/50'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{email.from}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(email.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{email.subject}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Email Content */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Message Content</h3>
            {selectedEmail ? (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-400">From</p>
                  <p className="font-medium">{selectedEmail.from}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Subject</p>
                  <p className="font-medium">{selectedEmail.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Content</p>
                  <p className="mt-2 p-4 bg-white/5 rounded-lg">{selectedEmail.content}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select an email to view its content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}