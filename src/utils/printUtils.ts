import html2canvas from "html2canvas";

export const handlePrintPDF = async (
  templateRef: React.RefObject<HTMLDivElement>
) => {
  if (!templateRef.current) return;

  // Show loading indicator
  const loadingIndicator = document.createElement("div");
  loadingIndicator.className =
    "fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 z-50";
  loadingIndicator.innerHTML =
    '<div class="bg-white p-4 rounded-lg">Menyiapkan PDF...</div>';
  document.body.appendChild(loadingIndicator);

  try {
    // Import jsPDF secara dinamis
    const jsPDFModule = await import("jspdf");
    const jsPDF = jsPDFModule.default;

    // Make the template temporarily visible but offscreen for better rendering
    const template = templateRef.current;
    const originalStyle = template.style.display;
    template.style.display = "block";

    setTimeout(() => {
      html2canvas(template, {
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "white",
        onclone: (clonedDoc) => {
          const clonedTemplate = clonedDoc.querySelector("#print-template");
          if (clonedTemplate) {
            (clonedTemplate as HTMLElement).style.display = "block";
            (clonedTemplate as HTMLElement).style.visibility = "visible";
          }
        },
      })
        .then((canvas) => {
          template.style.cssText = originalStyle;

          const imgData = canvas.toDataURL("image/jpeg", 0.95);
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const marginLeft = 6;
          const marginTop = 10;
          const contentWidth = pageWidth - marginLeft * 2;

          const imgWidth = contentWidth;
          const imgHeight = (canvas.height * contentWidth) / canvas.width;

          let heightLeft = imgHeight;
          let position = marginTop;

          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save(
            `rekomendasi_makanan_sehat_${new Date().toLocaleDateString()}.pdf`
          );
          document.body.removeChild(loadingIndicator);
        })
        .catch((error) => {
          console.error("PDF generation error:", error);
          template.style.cssText = originalStyle;
          document.body.removeChild(loadingIndicator);
          alert("Gagal membuat PDF. Silakan coba lagi.");
        });
    }, 200);
  } catch (error) {
    console.error("Error importing jsPDF:", error);
    document.body.removeChild(loadingIndicator);
    alert("Gagal memuat modul PDF. Silakan coba lagi.");
  }
};
