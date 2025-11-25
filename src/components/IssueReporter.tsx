import React, { useEffect, useState } from 'react';

interface IssueReporterProps {
  isOpen: boolean;
  onClose: () => void;
  repoOwner?: string;
  repoName?: string;
  defaultTitle?: string;
  defaultBody?: string;
  simpleMode?: boolean; // when true, hide advanced token input
}

const IssueReporter: React.FC<IssueReporterProps> = ({
  isOpen,
  onClose,
  repoOwner = 'devzone-creator',
  repoName = 'WAQ-analyzer',
  defaultTitle = '',
  defaultBody = '',
  simpleMode = true
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [body, setBody] = useState(defaultBody);
  const [token, setToken] = useState<string>('');
  const [savingToken, setSavingToken] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    setTitle(defaultTitle);
    setBody(defaultBody);
  }, [defaultTitle, defaultBody, isOpen]);

  const openPrefilledIssue = () => {
    const url = `https://github.com/${repoOwner}/${repoName}/issues/new`;
    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (body) params.set('body', body);
    const final = `${url}?${params.toString()}`;
    window.open(final, '_blank');
    onClose();
  };

  const createIssueViaApi = async () => {
    setResult(null);
    if (!token) {
      setResult('Provide a GitHub personal access token with repo:issues scope to create an issue via API.');
      return;
    }

    setSavingToken(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`
        },
        body: JSON.stringify({ title, body })
      });

      if (res.ok) {
        const json = await res.json();
        setResult(`Issue created: ${json.html_url}`);
      } else {
        const errText = await res.text();
        setResult(`Failed to create issue: ${res.status} ${errText}`);
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message?: string }).message : String(err);
      setResult(`Error: ${msg}`);
    } finally {
      setSavingToken(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-xl w-full p-6 z-10">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Report an Issue / Feedback</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        <p className="text-sm text-gray-600 mt-2 mb-4">This creates a prefilled GitHub issue for the repository. Click "Open on GitHub (one click)" — then sign in and submit on GitHub. This is the simplest flow for users without GitHub knowledge.</p>

        <input
          className="w-full px-3 py-2 border rounded mb-2"
          placeholder="Issue title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full px-3 py-2 border rounded mb-2"
          placeholder="Describe the issue or feedback..."
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <div className="flex gap-2 mb-3">
          <button onClick={openPrefilledIssue} className="px-3 py-2 bg-blue-600 text-white rounded">Open on GitHub (one click)</button>
          {!simpleMode && (
            <button onClick={createIssueViaApi} className="px-3 py-2 bg-green-600 text-white rounded">Create via API</button>
          )}
          <div className="flex-1" />
          <button onClick={onClose} className="px-3 py-2 bg-gray-100 rounded">Close</button>
        </div>

        {!simpleMode && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-1">Optional: Provide a personal access token to create an issue directly (client-side). Token is only used in memory.</p>
            <input
              className="w-full px-3 py-2 border rounded"
              placeholder="GitHub Personal Access Token (optional)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
            />
          </div>
        )}

        {savingToken && <p className="text-sm text-gray-600">Creating issue...</p>}
        {result && <p className="text-sm mt-2 text-gray-800">{result}</p>}
      </div>
    </div>
  );
};

export default IssueReporter;
