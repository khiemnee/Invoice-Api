import { Request, Response } from "express";
import { ReturnQueryFromVNPay, VNPay, ignoreLogger } from "vnpay";
import { AppDataSource } from "../database/data-source";
import { Invoice } from "../entity/Invoice";
import { totalAmount } from "../helpers/invoice.helper";
import { invoiceStatus } from "../database/enums/invoiceStatus";
import {
  vnpayAddress,
  vnpayHost,
  vnpaySecureSecret,
  vnpayTmnCode,
} from "../secret";
import connection from "../services/redis.service";

const vnpay = new VNPay({
  tmnCode: vnpayTmnCode,
  secureSecret: vnpaySecureSecret,
  vnpayHost: vnpayHost,
  testMode: true,
  enableLog: true,
  loggerFn: ignoreLogger,
  endpoints: {
    paymentEndpoint: "paymentv2/vpcpay.html",
    queryDrRefundEndpoint: "merchant_webapi/api/transaction",
    getBankListEndpoint: "qrpayauth/api/merchant/get_bank_list",
  },
});

const invoiceRepositoty = AppDataSource.getRepository(Invoice);

export const invoicePayment = async (req: Request, res: Response) => {
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
        error: "Invoice not found",
      });
      return;
    }

    const totalAmountItems = totalAmount(invoice.items);

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: totalAmountItems,
      vnp_IpAddr: vnpayAddress,
      vnp_ReturnUrl: "http://localhost:3000/api/payment/status",
      vnp_TxnRef: invoice.id.toString(),
      vnp_OrderInfo: `Thanh toán đơn hàng #${invoice.id}`,
    });

 
    res.status(201).send(paymentUrl);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const invoicePaymentStatus = async (req: Request, res: Response) => {
  try {
    const verify = vnpay.verifyReturnUrl(req.query as ReturnQueryFromVNPay);
    const invoiceId = Number(verify.vnp_TxnRef);


    if (verify.isSuccess) {
      await invoiceRepositoty.update(
        { id: invoiceId },
        { status: invoiceStatus.PAID }
      );
      res.status(200).send("payment sucessfull !!!");
      return;
    }

    await invoiceRepositoty.update(
      { id: invoiceId },
      { status: invoiceStatus.UNPAID }
    );
    res.status(200).send("payment canceld !!!");
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
  }
};
