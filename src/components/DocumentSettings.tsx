'use client';

import { Fragment, useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild, Listbox, ListboxButton, ListboxOptions, ListboxOption, Button } from '@headlessui/react';
import { useConfig, ViewType } from '@/contexts/ConfigContext';
import { ChevronUpDownIcon, CheckIcon } from '@/components/icons/Icons';
import { useEPUB } from '@/contexts/EPUBContext';

const isDev = process.env.NEXT_PUBLIC_NODE_ENV !== 'production' || process.env.NODE_ENV == null;

interface DocViewSettingsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  epub?: boolean;
}

const viewTypes = [
  { id: 'single', name: 'Single Page' },
  { id: 'dual', name: 'Two Pages' },
  { id: 'scroll', name: 'Continuous Scroll' },
];

export function DocumentSettings({ isOpen, setIsOpen, epub }: DocViewSettingsProps) {
  const { viewType, skipBlank, epubTheme, textExtractionMargin, updateConfigKey } = useConfig();
  const { createFullAudioBook } = useEPUB();
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localMargin, setLocalMargin] = useState(textExtractionMargin);
  const abortControllerRef = useRef<AbortController | null>(null);
  const selectedView = viewTypes.find(v => v.id === viewType) || viewTypes[0];

  //console.log(localMargin, textExtractionMargin);

  // Sync local margin with global state
  useEffect(() => {
    setLocalMargin(textExtractionMargin);
  }, [textExtractionMargin]);

  // Handler for slider change (updates local state only)
  const handleMarginChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMargin(Number(event.target.value));
  }, []);

  // Handler for slider release
  const handleMarginChangeComplete = useCallback(() => {
    if (localMargin !== textExtractionMargin) {
      updateConfigKey('textExtractionMargin', localMargin);
    }
  }, [localMargin, textExtractionMargin, updateConfigKey]);

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setProgress(0);
    abortControllerRef.current = new AbortController();

    try {
      const audioBuffer = await createFullAudioBook(
        (progress) => setProgress(progress),
        abortControllerRef.current.signal
      );

      // Create and trigger download
      const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audiobook.mp3';
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error generating audiobook:', error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform rounded-2xl bg-base p-6 text-left align-middle shadow-xl transition-all">
                <div className="space-y-4">
                  {isDev && <div className="space-y-2 pb-2">
                    {!isGenerating ? (
                      <Button
                        type="button"
                        className="w-full inline-flex justify-center rounded-lg bg-accent px-4 py-2 text-sm 
                                       font-medium text-background hover:opacity-95 focus:outline-none 
                                       focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                                       transform transition-transform duration-200 ease-in-out hover:scale-[1.04]"
                        onClick={handleStartGeneration}
                      >
                        Export to Audiobook (experimental)
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-full bg-background rounded-lg overflow-hidden">
                          <div
                            className="h-2 bg-accent transition-all duration-300 ease-in-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-sm text-muted">
                          <span>{Math.round(progress)}% complete</span>
                          <Button
                            type="button"
                            className="inline-flex justify-center rounded-lg px-2.5 py-1 text-sm 
                                    font-medium text-foreground hover:text-accent focus:outline-none 
                                    focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                                    transform transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                            onClick={handleCancel}
                          >
                            Cancel and download
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>}
                  {!epub && <div className="space-y-6">
                    <div className="mt-4 space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Text Extraction Margin
                      </label>
                      <div className="flex justify-between">
                        <span className="text-xs">0%</span>
                        <span className="text-xs font-bold">{Math.round(localMargin * 100)}%</span>
                        <span className="text-xs">20%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.2"
                        step="0.01"
                        value={localMargin}
                        onChange={handleMarginChange}
                        onMouseUp={handleMarginChangeComplete}
                        onKeyUp={handleMarginChangeComplete}
                        onTouchEnd={handleMarginChangeComplete}
                        className="w-full bg-offbase rounded-lg appearance-none cursor-pointer accent-accent [&::-webkit-slider-runnable-track]:bg-offbase [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-moz-range-track]:bg-offbase [&::-moz-range-track]:rounded-lg [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent"
                      />
                      <p className="text-xs text-muted">
                        {"Don't"} include content from outer rim of the page during text extraction (experimental)
                      </p>
                    </div>
                    <Listbox
                      value={selectedView}
                      onChange={(newView) => updateConfigKey('viewType', newView.id as ViewType)}
                    >
                      <div className="relative z-10 space-y-2">
                        <label className="block text-sm font-medium text-foreground">Mode</label>
                        <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-background py-2 pl-3 pr-10 text-left text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-accent transform transition-transform duration-200 ease-in-out hover:scale-[1.01] hover:text-accent">
                          <span className="block truncate">{selectedView.name}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-muted" />
                          </span>
                        </ListboxButton>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-background py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                            {viewTypes.map((view) => (
                              <ListboxOption
                                key={view.id}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-accent/10 text-accent' : 'text-foreground'
                                  }`
                                }
                                value={view}
                              >
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                      {view.name}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-accent">
                                        <CheckIcon className="h-5 w-5" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </Transition>
                        {selectedView.id === 'scroll' && (
                          <p className="text-sm text-warning pt-2">
                            Note: Continuous scroll may perform poorly for larger documents.
                          </p>
                        )}
                      </div>
                    </Listbox>

                  </div>}

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={skipBlank}
                        onChange={(e) => updateConfigKey('skipBlank', e.target.checked)}
                        className="form-checkbox h-4 w-4 text-accent rounded border-muted"
                      />
                      <span className="text-sm font-medium text-foreground">Skip blank pages</span>
                    </label>
                    <p className="text-sm text-muted pl-6">
                      Automatically skip pages with no text content
                    </p>
                  </div>
                  {epub && (
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={epubTheme}
                          onChange={(e) => updateConfigKey('epubTheme', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-accent rounded border-muted"
                        />
                        <span className="text-sm font-medium text-foreground">Use theme (experimental)</span>
                      </label>
                      <p className="text-sm text-muted pl-6">
                        Apply the current app theme to the EPUB viewer
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex justify-end">
                  <Button
                    type="button"
                    className="inline-flex justify-center rounded-lg bg-background px-4 py-2 text-sm 
                             font-medium text-foreground hover:bg-background/90 focus:outline-none 
                             focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                             transform transition-transform duration-200 ease-in-out hover:scale-[1.04] hover:text-accent z-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
