/**
 * Analytics.jsx
 * Dedicated MorTrack Power BI Analytics page.
 * Displays the real Power BI report embedded natively with a subtle yellow/gold border.
 * - filterPaneEnabled=false (Hides the right filters pane)
 * - navContentPaneEnabled=false (Hides the bottom page navigation tabs)
 * - 16:9 canvas aspect-ratio fitting with 1px gold border matching navbar separator
 */

import { useRef } from "react";
import Navbar from "../components/Navbar.jsx";

const REPORT_ID = "553d2c00-97f0-4483-9fef-05deb79dce25";
const TENANT_ID = "604f1a96-cbe8-43f8-abbf-f8eaf5d85730";

// Clean Power BI embed URL with filter pane and page navigation explicitly disabled
const POWER_BI_CLEAN_URL =
  `https://app.powerbi.com/reportEmbed?reportId=${REPORT_ID}&autoAuth=true&ctid=${TENANT_ID}&filterPaneEnabled=false&navContentPaneEnabled=false`;

export default function Analytics() {
  const containerRef = useRef(null);

  return (
    <>
      <Navbar />
      <main
        style={{
          width: "100%",
          height: "calc(100vh - 61px)",
          backgroundColor: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 16px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "calc((100vh - 85px) * 16 / 9)",
            maxHeight: "calc((100vw - 32px) * 9 / 16)",
            aspectRatio: "16 / 9",
            backgroundColor: "var(--bg)",
            border: "1px solid var(--navbar-border)",
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), 0 0 12px rgba(212, 175, 55, 0.05)",
            boxSizing: "border-box",
          }}
        >
          <iframe
            src={POWER_BI_CLEAN_URL}
            title="MorTrack Power BI Analytics"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
              backgroundColor: "var(--bg)",
            }}
            allowFullScreen={true}
          />
        </div>
      </main>
    </>
  );
}
