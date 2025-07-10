import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Invoice } from "../entity/Invoice";
import { convertItems, totalAmount } from "../helpers/invoice.helper";
import { sendEmailInvoiceJob } from "../jobs/email.job";
import { viewInvoicePdfQueue } from "../jobs/pdf.job";
import { Client } from "../entity/Client";

const invoiceRepositoty = AppDataSource.getRepository(Invoice);
const clientRepository = AppDataSource.getRepository(Client);

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, client, sort } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;
    if (client) where.client = { id: Number(client) };

    const order: any = {};
    if (sort) {
      const [field, direction] = (sort as string).split(":");
      order[field] = direction.toUpperCase();
    }

    const [invoices, total] = await invoiceRepositoty.findAndCount({
      where,
      skip,
      take: Number(limit),
      order,
      relations: ["client", "user"],
    });

    res.send({
      data: invoices,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const createInvoices = async (req: Request, res: Response) => {
  const { items, dueDate, id } = req.body;

  const date = new Date(dueDate);

  try {
    const totalAmountItems = totalAmount(items);
    const convertedItems = await convertItems(items);

    const invoice = invoiceRepositoty.create({
      client: { id },
      user: { id: req.user.id },
      dueDate: date,
      totalAmount: totalAmountItems,
      items: convertedItems,
    });

    await invoiceRepositoty.save(invoice);

    const client = await clientRepository.findOneBy({
      id: invoice.client.id,
    });

    await sendEmailInvoiceJob(invoice,client);

    res.status(201).send(invoice);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const getInvoice = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const invoice = await invoiceRepositoty.findOne({
      where: {
        id,
      },
      relations: ["items"],
    });

    if (!invoice) {
      res.status(404).send({
        error: "Invoice not found !!!",
      });
      return;
    }

    res.status(200).send(invoice);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["items", "dueDate", "client", "sent", "status"];

    const isMatch = updates.every((values) => allowedUpdates.includes(values));

    if (!isMatch) {
      res.status(404).send({
        error: "Invalid field to update !!!",
      });
      return;
    }

    const invoice = await invoiceRepositoty.findOneBy({
      id,
    });

    if (!invoice) {
      res.status(404).send({
        error: "invoice not found !!!",
      });
      return;
    }

    if (updates.includes("items")) {
      const convertedItems = await convertItems(req.body.items);
      const totalAmountItems = totalAmount(req.body.items);
      invoice.items = convertedItems;
      invoice.totalAmount = totalAmountItems;
    }

    if (updates.includes("dueDate")) {
      invoice.dueDate = new Date(req.body.dueDate);
    }

    Object.assign(invoice, req.body);
    await invoiceRepositoty.save(invoice);

    res.status(200).send(invoice);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const invoice = await invoiceRepositoty.delete({
      id,
    });

    if (!invoice) {
      res.status(500).send({
        error: "Something wrong, please try later !!!",
      });
      return;
    }
    res.status(200).send(invoice);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const getInvoicePdf = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const invoice = await invoiceRepositoty.findOne({
      where: {
        id,
      },
      relations: ["items", "client"],
    });

    if (!invoice) {
      res.status(404).send({
        error: "Invoice not found !!!",
      });
      return;
    }

    const pdf = await viewInvoicePdfQueue(invoice);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${invoice.id}.pdf`,
    });

    res.status(200).send(pdf);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};
