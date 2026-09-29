import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import { ClerkWrapper } from './context/ClerkWrapper'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkWrapper>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ClerkWrapper>
  </StrictMode>,
)
