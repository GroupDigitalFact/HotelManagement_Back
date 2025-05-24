import Event from "../event/event.model.js";
import EventInvoice from "./invoicesevents.models.js"; 
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";


export const generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id)
      .populate('hotel', 'name priceBaseEvent')
      .populate('user', 'email')
      .populate('servicios', 'name priceService');

    if (!event || !event.status) {
      return res.status(404).json({
        message: 'Evento no encontrado o está cancelado'
      });
    }

    if (typeof event.totalPrice !== 'number') {
      return res.status(400).json({
        message: 'El precio total del evento no está definido o es inválido.'
      });
    }

    // Carpeta invoices sin subcarpetas
    const invoicesDir = path.join(process.cwd(), 'invoices');

    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filename = `factura-evento-${event._id}.pdf`;
    const pdfPath = path.join(invoicesDir, filename);

    console.log('Factura guardada en:', pdfPath);

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fillColor('#444444')
      .fontSize(22)
      .text('Factura de Evento', { align: 'center' })
      .moveDown(0.5);

    doc.fontSize(10)
      .text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, { align: 'right' })
      .moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y)
      .strokeColor('#aaaaaa').stroke()
      .moveDown();

    doc.fontSize(14).fillColor('#000')
      .text(`Nombre del Evento: `, { continued: true })
      .font('Helvetica-Bold').text(event.nombre)
      .font('Helvetica')
      .text(`Descripción: ${event.descripcion}`)
      .text(`Fecha del Evento: ${new Date(event.fecha).toLocaleDateString()}`)
      .text(`Correo del Cliente: ${event.user.email}`)
      .moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Información del Hotel:')
      .font('Helvetica')
      .text(`Hotel: ${event.hotel.name}`)
      .text(`Precio base del evento: $${event.hotel.priceBaseEvent.toFixed(2)}`)
      .moveDown();

    doc.font('Helvetica-Bold').text('Servicios Adicionales:').font('Helvetica');

    if (event.servicios.length === 0) {
      doc.text('No se contrataron servicios adicionales.');
    } else {
      event.servicios.forEach((serv, i) => {
        doc.text(`${i + 1}. ${serv.name} - $${serv.priceService.toFixed(2)}`);
      });
    }

    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y)
      .strokeColor('#aaaaaa').stroke()
      .moveDown();

    doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000')
      .text(`Total a pagar: $${event.totalPrice.toFixed(2)}`, { align: 'right' });

    await EventInvoice.create({
      event: event._id,
      total: event.totalPrice
    });

    doc.end();

    writeStream.on('finish', () => {
      res.download(pdfPath, filename, (err) => {
        if (err) {
          return res.status(500).json({
            message: 'Error al descargar la factura',
            error: err.message
          });
        }
      });
    });

    writeStream.on('error', (err) => {
      return res.status(500).json({
        message: 'Error al escribir el archivo PDF',
        error: err.message
      });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error al generar la factura',
      error: error.message
    });
  }
};