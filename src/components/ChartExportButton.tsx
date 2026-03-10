import { useState, type RefObject } from "react";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";

interface ChartExportButtonProps {
  targetRef: RefObject<HTMLElement>;
  fileName: string;
}

const ChartExportButton = ({ targetRef, fileName }: ChartExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!targetRef.current || isExporting) return;

    try {
      setIsExporting(true);
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#09111f",
      });

      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button type="button" onClick={handleExport} className="chart-action-button" disabled={isExporting}>
      <Download className="h-3.5 w-3.5" />
      {isExporting ? "Exporting" : "Export PNG"}
    </button>
  );
};

export default ChartExportButton;
