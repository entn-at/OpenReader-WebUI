import { usePDF } from '@/context/PDFContext';
import Link from 'next/link';

export function DocumentList() {
  const { documents, removeDocument } = usePDF();

  if (documents.length === 0) {
    return (
      <div className="w-full text-center text-muted">
        No documents uploaded yet
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Your Documents</h2>
      <div className="bg-background rounded-lg shadow p-2 space-y-2">
        {documents.map((doc) => (
          <div 
            key={doc.id}
            className="flex items-center justify-between hover:bg-base p-1 rounded-lg transition-colors"
          >
            <Link 
              href={`/pdf/${encodeURIComponent(doc.id)}`}
              className="flex items-center space-x-4 flex-1"
            >
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-foreground">{doc.name}</h3>
                <p className="text-sm text-muted">
                  {(doc.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </Link>
            <button
              onClick={() => removeDocument(doc.id)}
              className="p-2 text-muted hover:text-accent transition-colors"
              title="Remove document"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
