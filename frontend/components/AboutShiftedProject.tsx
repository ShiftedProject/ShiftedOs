import React from 'react';

// This component's content has been primarily moved into sections within LandingPage.tsx
// to achieve the GitHub-style landing page.
// It is no longer rendered as a separate view by LandingPage.

const AboutShiftedProject: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">About Shifted Project (Content Moved)</h1>
      <p className="mt-4 text-gray-700">
        The content previously displayed here, including Mission, Vision, Core Belief, and Content Formats,
        has been integrated into the new landing page design to provide a more comprehensive and engaging
        experience, similar to modern product landing pages like GitHub's.
      </p>
      <p className="mt-2 text-gray-700">
        Please see the main sections on the new landing page:
      </p>
      <ul className="list-disc list-inside mt-2 text-gray-700">
        <li>Hero Section (for overall mission)</li>
        <li>Features Section (for mission details and content formats)</li>
        <li>Why ShiftedOS Section (for vision and core beliefs)</li>
      </ul>
    </div>
  );
};

export default AboutShiftedProject;
