import { AppDataSource } from "../database/data-source";
import { InvoiceItem } from "../entity/InvoiceItem";

const invoiceItemsRepository = AppDataSource.getRepository(InvoiceItem);

type RawItem = {
  name: string;
  quantity: number;
  price: number;
};

export const convertItems = async (items: RawItem[]) => {
  const convertedItems = items.map((values) =>
    invoiceItemsRepository.create({
      name: values.name,
      price: values.price,
      quantity: values.quantity,
    })
  );
  await invoiceItemsRepository.save(convertedItems)
  return convertedItems;
};

export const totalAmount = (items: RawItem[]) => {
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return totalAmount;
};

