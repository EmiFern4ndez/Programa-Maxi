package com.programamaxi.gestion_patrimonial.services;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.programamaxi.gestion_patrimonial.entity.BienPatrimonial;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class ReporteService {

    public static byte[] generarPdfBien(BienPatrimonial bien) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("Comprobante de Alta - Bien Patrimonial", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" ")); // Espaciado

        document.add(new Paragraph("N° Inventario: " + bien.getNumeroInventario()));
        document.add(new Paragraph("Descripción: " + bien.getDescripcion()));
        document.add(new Paragraph("Marca: " + (bien.getMarca() != null ? bien.getMarca() : "-")));
        document.add(new Paragraph("Estado: " + bien.getEstado()));
        document.add(new Paragraph("Código Patrimonial: " + bien.getCodigoPatrimonial()));

        document.close();
        return out.toByteArray();
    }

    public static byte[] generarDocxBien(BienPatrimonial bien) throws Exception {
        try (XWPFDocument document = new XWPFDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            XWPFParagraph title = document.createParagraph();
            XWPFRun runTitle = title.createRun();
            runTitle.setText("Comprobante de Alta - Bien Patrimonial");
            runTitle.setBold(true);
            runTitle.setFontSize(16);

            XWPFParagraph p = document.createParagraph();
            p.createRun().setText("N° Inventario: " + bien.getNumeroInventario());
            p.createRun().addBreak();
            p.createRun().setText("Descripción: " + bien.getDescripcion());
            p.createRun().addBreak();
            p.createRun().setText("Marca: " + (bien.getMarca() != null ? bien.getMarca() : "-"));

            document.write(out);
            return out.toByteArray();
        }
    }
}
