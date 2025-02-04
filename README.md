[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-orange.svg)](../../pulls)

# OpenReader WebUI

OpenReader WebUI is a sleek, web-based PDF reader with built-in Text-to-Speech capabilities, offering a seamless reading experience with synchronized audio narration.

- 🎯 **TTS API Integration**: Compatible with OpenAI API TTS and Kokoro FastAPI TTS, enabling high-quality voice narration
- 💾 **Local-First Architecture**: Secure document handling with IndexedDB browser storage - no server uploads required
- 🔍 **Smart Text Processing**: Real-time sentence detection and synchronized text highlighting during playback
- ⚡ **Modern Tech Stack**: Built with Next.js, React, and Tailwind CSS
- 🎨 **Customizable Experience**: 
  - Adjustable playback speed
  - Multiple voice options
  - Dark/light/system theme support
  - Persistent user settings
- 📱 **Cross-Platform**: Responsive design works seamlessly across desktop and mobile devices

## **Demo**

https://github.com/user-attachments/assets/323251e6-3b3b-43cc-b139-cdab01ca7d75

## Installation

### Prerequisites
- Node.js & npm (recommended: use [nvm](https://github.com/nvm-sh/nvm))

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/richardr1126/OpenReader-WebUI.git
   cd OpenReader-WebUI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the environment:
   ```bash
   cp .env.template .env
   # Edit .env with your configuration settings
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to run the app.

## **Features**
  - Real-time sentence by sentence text-to-speech via OpenAI API TTS, [Kokoro FastAPI TTS](https://github.com/remsky/Kokoro-FastAPI), or others compatible with the `/v1/audio/speech` endpoint
  - IndexedDB-powered local storage
  - Synchronized text highlighting during playback (using string similarity for best match on the page)
  - Configurable playback speed and voice options, which checks `/v1/audio/voices` for available voices
  - Click-to-skip on the same page for navigation
  - Responsive design with light, dark, and system themes
  - All configuration settings saved in IndexedDB

## Stack

- **Framework:** Next.js (React)
- **Storage:** IndexedDB (in broswer db store)
- **PDF Processing:** 
  - [react-pdf](https://github.com/wojtekmaj/react-pdf)
  - [pdf.js](https://mozilla.github.io/pdf.js/)
  - Compromise for text analysis
- **UI Components:** 
  - Headless UI
  - Tailwind CSS
- **TTS Integration:** anything you want

## Project Structure

```
src/
├── app/           // Next.js app router
├── components/    // Reusable UI components
├── contexts/      // State management contexts
└── services/      // Utility functions & integrations
```

## Contributing

Contributions are welcome! Fork the repository and submit a pull request with your changes. For significant alterations, please open an issue first.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [react-pdf](https://github.com/wojtekmaj/react-pdf)
- [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) for text-to-speech
- [Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) for the API wrapper

## Support

If you encounter issues or have suggestions, please open an issue on GitHub.

<!-- ...existing sections for further documentation or credits if needed... -->
