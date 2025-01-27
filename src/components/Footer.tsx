import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

export function Footer() {
  return (
    <footer className="m-8 text-sm text-muted">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center text-center md:space-x-3">
          <Popover className="flex relative">
            <PopoverButton className="hover:text-foreground transition-colors">
              Privacy info
            </PopoverButton>
            <PopoverPanel anchor="bottom start" className="bg-base p-4 rounded-lg shadow-lg w-64">
              <p>No data collection. Documents are uploaded to your local browser cache.</p>
              <p className='mt-3'>Each sentence of the document you are viewing is sent to my FastAPI server for audio generation, no requests or data is collected.</p>
            </PopoverPanel>
          </Popover>
          <span className='w-full md:w-fit'>•</span>
          <span>
            Powered by{' '}
            <a
              href="https://huggingface.co/hexgrad/Kokoro-82M"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:text-foreground transition-colors"
            >
              hexgrad/Kokoro-82M
            </a>
            {' '}and{' '}
            <a
              href="https://github.com/remsky/Kokoro-FastAPI/tree/master"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:text-foreground transition-colors"
            >
              Kokoro-FastAPI
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
