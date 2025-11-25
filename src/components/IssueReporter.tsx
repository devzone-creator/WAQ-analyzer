import React, { useState } from 'react';

interface IssueReporterProps {
  repoOwner?: string;
  repoName?: string;
  defaultTitle?: string;
  defaultBody?: string;
}

export const IssueReporter: React.FC<IssueReporterProps> = ({
  repoOwner = 'devzone-creator',
  repoName = 'WAQ-analyzer',
  defaultTitle = '',
  defaultBody = ''
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [body, setBody] = useState(defaultBody);
  const [token, setToken] = useState<string>('');
  const [savingToken, setSavingToken] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);

  const openPrefilledIssue = () => {
    const url = `https://github.com/${repoOwner}/${repoName}/issues/new`;
    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (body) params.set('body', body);
    const final = `${url}?${params.toString()}`;
    window.open(final, '_blank');
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

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded bg-white">
      <h4 className="font-semibold mb-2">Report an Issue / Feedback</h4>
      <p className="text-sm text-gray-600 mb-3">Create a GitHub issue for this repository (prefilled). Two options: open GitHub's new-issue page or create directly via API using a personal token.</p>

      <input
        className="w-full px-3 py-2 border rounded mb-2"
        placeholder="Issue title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full px-3 py-2 border rounded mb-2"
        placeholder="Describe the issue or feedback..."
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="flex gap-2">
        <button onClick={openPrefilledIssue} className="px-3 py-2 bg-blue-600 text-white rounded">Open on GitHub (recommended)</button>
        <button onClick={createIssueViaApi} className="px-3 py-2 bg-green-600 text-white rounded">Create via API</button>
      </div>

      <div className="mt-3">
        <p className="text-xs text-gray-600 mb-2">Optional: Provide a personal access token to create an issue directly (client-side). Token is only used in memory.</p>
        <input
          className="w-full px-3 py-2 border rounded mb-2"
          placeholder="GitHub Personal Access Token (optional)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          type="password"
        />
        {savingToken && <p className="text-sm text-gray-600">Creating issue...</p>}
        {result && <p className="text-sm mt-2 text-gray-800">{result}</p>}
      </div>
    </div>
  );
};

export default IssueReporter;
