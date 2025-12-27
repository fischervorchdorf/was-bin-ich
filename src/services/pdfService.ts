import jsPDF from 'jspdf';
import { ArtifactAnalysis } from '../types';

export const generatePDF = async (analysis: ArtifactAnalysis, images: File[]): Promise<void> => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (neededSpace: number) => {
        if (yPosition + neededSpace > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    };

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.setTextColor(color[0], color[1], color[2]);
        const lines = pdf.splitTextToSize(text, contentWidth);
        const textHeight = lines.length * fontSize * 0.35;
        checkPageBreak(textHeight + 5);
        pdf.text(lines, margin, yPosition);
        yPosition += textHeight + 3;
    };

    // Header
    pdf.setFillColor(45, 45, 45);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Was bin ich?', margin, 20);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(analysis.identity.name, margin, 30);
    yPosition = 50;

    // Images with correct aspect ratio
    const maxImageWidth = (contentWidth - 10) / 2;
    const maxImageHeight = 40;  // Reduced for better portrait handling
    const maxPortraitWidth = 30; // Max width for portrait-oriented images

    for (let i = 0; i < Math.min(images.length, 4); i++) {
        const img = images[i];
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
            reader.onload = (e) => {
                if (e.target?.result) {
                    const imgData = e.target.result as string;
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        // Calculate aspect ratio
                        const aspectRatio = tempImg.width / tempImg.height;
                        const isPortrait = aspectRatio < 1; // width < height

                        let imgWidth: number;
                        let imgHeight: number;

                        if (isPortrait) {
                            // For portrait images, limit width first to prevent distortion
                            imgWidth = maxPortraitWidth;
                            imgHeight = imgWidth / aspectRatio;
                            // Make sure height doesn't exceed max
                            if (imgHeight > maxImageHeight) {
                                imgHeight = maxImageHeight;
                                imgWidth = imgHeight * aspectRatio;
                            }
                        } else {
                            // For landscape images, use original logic
                            imgWidth = maxImageWidth;
                            imgHeight = imgWidth / aspectRatio;

                            // If height exceeds max, scale down
                            if (imgHeight > maxImageHeight) {
                                imgHeight = maxImageHeight;
                                imgWidth = imgHeight * aspectRatio;
                            }
                        }
                        }

                        const x = margin + (i % 2) * (maxImageWidth + 10);
                        const y = yPosition + Math.floor(i / 2) * (maxImageHeight + 5);

                        checkPageBreak(y - yPosition + imgHeight + 5);

                        try {
                            pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');
                        } catch (err) {
                            console.log('Could not add image', err);
                        }
                        resolve();
                    };
                    tempImg.src = imgData;
                } else {
                    resolve();
                }
            };
            reader.readAsDataURL(img);
        });
    }
    yPosition += (Math.ceil(images.length / 2) * (maxImageHeight + 5)) + 10;

    // Identity Section
    checkPageBreak(40);
    pdf.setFillColor(212, 175, 55);
    pdf.rect(margin, yPosition, contentWidth, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Identität', margin + 3, yPosition + 7);
    yPosition += 15;

    addText(`Name: ${analysis.identity.name}`, 11, true);
    addText(`Kategorie: ${analysis.identity.category}`, 10);
    addText(`Zeitraum: ${analysis.identity.timePeriod}`, 10);
    addText(`Datierung: ${analysis.identity.creationDate}`, 10);
    addText(`Ursprünglicher Zweck: ${analysis.identity.originalPurpose}`, 10);
    yPosition += 5;

    // Deductions
    if (analysis.story.deductions && analysis.story.deductions.length > 0) {
        checkPageBreak(30);
        pdf.setFillColor(180, 120, 20);
        pdf.rect(margin, yPosition, contentWidth, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Die Deduktion', margin + 3, yPosition + 7);
        yPosition += 15;

        analysis.story.deductions.forEach((deduction, i) => {
            addText(`${i + 1}. ${deduction}`, 9);
        });
        yPosition += 5;
    }

    // Detail Highlights
    if (analysis.story.detailHighlights && analysis.story.detailHighlights.length > 0) {
        checkPageBreak(30);
        pdf.setFillColor(212, 175, 55);
        pdf.rect(margin, yPosition, contentWidth, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Besondere Details', margin + 3, yPosition + 7);
        yPosition += 15;

        analysis.story.detailHighlights.forEach((detail) => {
            addText(`• ${detail}`, 9);
        });
        yPosition += 5;
    }

    // Rarity Scores
    if (analysis.rarityScores) {
        checkPageBreak(50);
        pdf.setFillColor(212, 175, 55);
        pdf.rect(margin, yPosition, contentWidth, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Bewertung', margin + 3, yPosition + 7);
        yPosition += 15;

        const scores = [
            { label: 'Seltenheit', value: analysis.rarityScores.rarity },
            { label: 'Erhaltung', value: analysis.rarityScores.condition },
            { label: 'Historischer Wert', value: analysis.rarityScores.historicalValue }
        ];

        scores.forEach(score => {
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${score.label}: ${score.value}/10`, margin, yPosition);

            // Draw progress bar
            const barWidth = contentWidth - 40;
            const barX = margin + 40;
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(barX, yPosition - 3, barWidth, 4);
            pdf.setFillColor(212, 175, 55);
            pdf.rect(barX, yPosition - 3, (barWidth * score.value) / 10, 4, 'F');
            yPosition += 8;
        });

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Gesamtwert: ${analysis.rarityScores.overall.toFixed(1)}/10`, margin, yPosition);
        yPosition += 10;
    }

    // Modern Comparison
    if (analysis.modernComparison) {
        checkPageBreak(40);
        pdf.setFillColor(128, 90, 150);
        pdf.rect(margin, yPosition, contentWidth, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Damals vs. Heute: ${analysis.modernComparison.modernName}`, margin + 3, yPosition + 7);
        yPosition += 15;

        analysis.modernComparison.comparisons.forEach(comp => {
            checkPageBreak(20);
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text(comp.category, margin, yPosition);
            yPosition += 5;
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Historisch: ${comp.historical}`, margin + 5, yPosition);
            yPosition += 5;
            pdf.text(`Modern: ${comp.modern}`, margin + 5, yPosition);
            yPosition += 7;
        });
        yPosition += 5;
    }

    // Social & Economic Context
    if (analysis.socialContext || analysis.economicContext) {
        checkPageBreak(50);
        pdf.setFillColor(45, 125, 115); // Teal color
        pdf.rect(margin, yPosition, contentWidth, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Soziale & Wirtschaftliche Dimension', margin + 3, yPosition + 7);
        yPosition += 15;

        if (analysis.socialContext) {
            if (analysis.socialContext.genderRole) {
                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Geschlechterrollen:', margin, yPosition);
                yPosition += 5;
                pdf.setFont('helvetica', 'normal');
                const lines = pdf.splitTextToSize(analysis.socialContext.genderRole, contentWidth - 5);
                pdf.text(lines, margin + 5, yPosition);
                yPosition += lines.length * 4 + 3;
            }

            if (analysis.socialContext.socialClass) {
                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Soziale Schicht:', margin, yPosition);
                yPosition += 5;
                pdf.setFont('helvetica', 'normal');
                const lines = pdf.splitTextToSize(analysis.socialContext.socialClass, contentWidth - 5);
                pdf.text(lines, margin + 5, yPosition);
                yPosition += lines.length * 4 + 3;
            }
        }

        if (analysis.economicContext) {
            if (analysis.economicContext.historicalPrice) {
                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Damaliger Preis:', margin, yPosition);
                yPosition += 5;
                pdf.setFont('helvetica', 'normal');
                pdf.text(analysis.economicContext.historicalPrice, margin + 5, yPosition);
                yPosition += 7;
            }

            if (analysis.economicContext.modernEquivalent) {
                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Heutige Kaufkraft:', margin, yPosition);
                yPosition += 5;
                pdf.setFont('helvetica', 'normal');
                pdf.text(analysis.economicContext.modernEquivalent, margin + 5, yPosition);
                yPosition += 7;
            }
        }

        yPosition += 5;
    }

    // Visual Analysis - only for photos/paintings
    if (analysis.visualAnalysis) {
        checkPageBreak(50);
        pdf.setFillColor(125, 70, 150); // Purple color
        pdf.rect(margin, yPosition, contentWidth, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Bildanalyse & Kontext', margin + 3, yPosition + 7);
        yPosition += 15;

        if (analysis.visualAnalysis.composition) {
            addText('Komposition & Technik:', 10, true);
            addText(analysis.visualAnalysis.composition, 9);
            yPosition += 3;
        }

        if (analysis.visualAnalysis.clothing) {
            addText('Kleidung & Status:', 10, true);
            addText(analysis.visualAnalysis.clothing, 9);
            yPosition += 3;
        }

        if (analysis.visualAnalysis.background) {
            addText('Hintergrund & Umgebung:', 10, true);
            addText(analysis.visualAnalysis.background, 9);
            yPosition += 3;
        }

        if (analysis.visualAnalysis.invisibleContext) {
            addText('Der unsichtbare Kontext:', 10, true);

            if (analysis.visualAnalysis.invisibleContext.missing) {
                addText(`Was fehlt? ${analysis.visualAnalysis.invisibleContext.missing}`, 9);
            }

            if (analysis.visualAnalysis.invisibleContext.creator) {
                addText(`Fotograf/Maler: ${analysis.visualAnalysis.invisibleContext.creator}`, 9);
            }

            if (analysis.visualAnalysis.invisibleContext.purpose) {
                addText(`Zweck: ${analysis.visualAnalysis.invisibleContext.purpose}`, 9);
            }
        }

        if (analysis.visualAnalysis.representationChange) {
            addText('Darstellungswandel:', 10, true);
            addText(analysis.visualAnalysis.representationChange, 9);
        }

        yPosition += 5;
    }

    // Timeline
    if (analysis.timeline && analysis.timeline.length > 0) {
        checkPageBreak(50);
        pdf.setFillColor(50, 80, 150);
        pdf.rect(margin, yPosition, contentWidth, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Zeitreise', margin + 3, yPosition + 7);
        yPosition += 15;

        analysis.timeline.forEach((milestone) => {
            checkPageBreak(15);
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${milestone.year} - ${milestone.label}`, margin, yPosition);
            yPosition += 5;
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            const descLines = pdf.splitTextToSize(milestone.description, contentWidth - 10);
            pdf.text(descLines, margin + 5, yPosition);
            yPosition += descLines.length * 3.5 + 3;
        });
        yPosition += 5;
    }

    // Evolution - DARKER COLORS for better visibility
    checkPageBreak(40);
    pdf.setFillColor(80, 80, 80); // Dark gray instead of light beige
    pdf.rect(margin, yPosition, contentWidth, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Wandel der Zeit', margin + 3, yPosition + 7);
    yPosition += 15;

    addText(`Status heute: ${analysis.evolution.modernStatus}`, 10, true);
    addText('Historische Entwicklung:', 10, true);
    analysis.evolution.historicalChanges.forEach((change, i) => {
        addText(`${i + 1}. ${change}`, 9);
    });
    addText(`Kulturelle Bedeutung: ${analysis.evolution.culturalSignificance}`, 10);
    yPosition += 5;

    // Story
    checkPageBreak(50);
    pdf.setFillColor(100, 60, 120);
    pdf.rect(margin, yPosition, contentWidth, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Meine Geschichte (Ich-Perspektive)', margin + 3, yPosition + 7);
    yPosition += 15;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'italic');
    const titleLines = pdf.splitTextToSize(`"${analysis.story.title}"`, contentWidth);
    pdf.text(titleLines, margin, yPosition);
    yPosition += titleLines.length * 5 + 5;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const narrativeLines = pdf.splitTextToSize(analysis.story.narrative, contentWidth);
    narrativeLines.forEach((line: string) => {
        checkPageBreak(5);
        pdf.text(line, margin, yPosition);
        yPosition += 4;
    });
    yPosition += 10;

    // Long Story - if available
    if (analysis.story.longNarrative) {
        checkPageBreak(50);
        pdf.setFillColor(80, 40, 100); // Darker purple
        pdf.rect(margin, yPosition, contentWidth, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Zeitgeschichte (Historische Erzählung)', margin + 3, yPosition + 7);
        yPosition += 15;

        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        const longNarrativeLines = pdf.splitTextToSize(analysis.story.longNarrative, contentWidth);
        longNarrativeLines.forEach((line: string) => {
            checkPageBreak(5);
            pdf.text(line, margin, yPosition);
            yPosition += 4;
        });
        yPosition += 10;
    }

    // Summary
    if (analysis.story.summary) {
        checkPageBreak(20);
        pdf.setFillColor(245, 245, 220);
        pdf.setDrawColor(212, 175, 55);
        pdf.setLineWidth(0.5);
        pdf.rect(margin, yPosition, contentWidth, 15, 'FD');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Fazit:', margin + 2, yPosition + 5);
        yPosition += 8;
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(9);
        const summaryLines = pdf.splitTextToSize(analysis.story.summary, contentWidth - 4);
        pdf.text(summaryLines, margin + 2, yPosition);
        yPosition += summaryLines.length * 3.5 + 5;
    }

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Powered by Heimatverein Vorchdorf - Was bin ich?', margin, pageHeight - 10);

    // Save PDF
    pdf.save(`${analysis.identity.name.replace(/[^a-z0-9]/gi, '_')}_Analyse.pdf`);
};
