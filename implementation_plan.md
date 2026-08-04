# Implementation Plan: Serra G&S React Website

## Goal Description
Create a responsive, premium blue React website for Serra G&S. The site will be in Brazilian Portuguese (pt-BR) and include key sections such as a Hero, Services, Portfolio, Contact Form, Header/Footer, and a floating WhatsApp button.

## Proposed Changes

### Project Foundation
- **Initialize Vite React App** in the target directory.
- **[MODIFY] index.html**: Update title and meta tags for SEO (title, description in pt-BR).
- **[MODIFY] src/index.css**: Define a custom "premium blue" design system (CSS variables for primary/secondary blues, neutral colors, modern fonts like Inter or Roboto, and smooth animations).

### Components Structure
Create a modular component structure inside `/src/components/`:
- **[NEW] src/components/Header.jsx**: Navigation bar.
- **[NEW] src/components/Hero.jsx**: Impactful first impression section.
- **[NEW] src/components/Services.jsx**: Grid of service cards with hover micro-animations.
- **[NEW] src/components/Portfolio.jsx**: Showcase of past projects.
- **[NEW] src/components/Contact.jsx**: Responsive contact form.
- **[NEW] src/components/Footer.jsx**: Company information and links.
- **[NEW] src/components/WhatsAppButton.jsx**: Fixed floating button for quick contact.

### Main Application
- **[MODIFY] src/App.jsx**: Assemble all components into a seamless, single-page scroll layout. Ensure sections have appropriate padding and responsive behavior.
- **[MODIFY] src/App.css**: Add any app-specific layout wrappers if needed, though most styling will rely on `index.css` classes for consistency.

## Verification Plan

### Automated / Dev Server Testing
- `npm install` and `npm run dev` to start the local development server.
- No unit tests to write initially, focus is purely visual frontend.

### Manual Verification
- Render the site on the local browser or ask the user to open `http://localhost:5173` to visually verify:
  1. The "premium blue" aesthetic is applied globally.
  2. All sections are visible and correctly ordered.
  3. The website is responsive (mobile vs desktop).
  4. All copy is in Brazilian Portuguese.
  5. The WhatsApp floating button stays fixed on screen.
