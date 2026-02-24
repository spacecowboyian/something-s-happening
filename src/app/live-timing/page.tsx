'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const DEFAULT_URL = 'https://www.kcrscca.org/solo/live/results_live.htm';
const POLL_INTERVAL_MS = 10000;

type InputMode = 'url' | 'upload';

export default function LiveTimingPage() {
  const [mode, setMode] = useState<InputMode>('url');
  const [url, setUrl] = useState(DEFAULT_URL);
  const [pendingUrl, setPendingUrl] = useState(DEFAULT_URL);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll the URL every 10 seconds in URL mode
  useEffect(() => {
    if (mode !== 'url' || !url) return;

    intervalRef.current = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mode, url]);

  function handleModeChange(next: InputMode) {
    setMode(next);
  }

  function handleUrlSubmit() {
    setUrl(pendingUrl);
    setRefreshKey(0);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setHtmlContent(ev.target?.result as string);
    };
    reader.onerror = () => {
      setFileError('Failed to read file. Please try again.');
      setHtmlContent(null);
    };
    reader.readAsText(file);
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Back</Link>
        <h1 className={styles.title}>Live Timing</h1>
      </header>

      <div className={styles.controls}>
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeButton} ${mode === 'url' ? styles.modeButtonActive : ''}`}
            onClick={() => handleModeChange('url')}
          >
            URL
          </button>
          <button
            className={`${styles.modeButton} ${mode === 'upload' ? styles.modeButtonActive : ''}`}
            onClick={() => handleModeChange('upload')}
          >
            Upload HTML
          </button>
        </div>

        {mode === 'url' && (
          <div className={styles.urlRow}>
            <input
              type="url"
              className={styles.urlInput}
              value={pendingUrl}
              onChange={(e) => setPendingUrl(e.target.value)}
              placeholder="https://..."
              aria-label="Live timing URL"
            />
            <button className={styles.loadButton} onClick={handleUrlSubmit}>
              Load
            </button>
            <span className={styles.pollBadge}>Refreshes every 10 s</span>
          </div>
        )}

        {mode === 'upload' && (
          <div className={styles.uploadRow}>
            <label className={styles.fileLabel}>
              <input
                type="file"
                accept=".html,.htm"
                className={styles.fileInput}
                onChange={handleFileChange}
                aria-label="Upload HTML timing file"
              />
              {fileName ? fileName : 'Choose HTML file…'}
            </label>
          </div>
        )}
      </div>

      <div className={styles.viewer}>
        {mode === 'url' && url && (
          <iframe
            key={refreshKey}
            src={url}
            className={styles.iframe}
            title="Live timing results"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}

        {mode === 'upload' && htmlContent && (
          <iframe
            srcDoc={htmlContent}
            className={styles.iframe}
            title="Uploaded timing results"
            sandbox="allow-scripts"
          />
        )}

        {mode === 'upload' && !htmlContent && (
          <div className={styles.placeholder}>
            {fileError ? (
              <span className={styles.error}>{fileError}</span>
            ) : (
              'Upload an HTML timing results file to view it here.'
            )}
          </div>
        )}
      </div>
    </div>
  );
}
