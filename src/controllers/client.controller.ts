import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Client } from "../entity/Client";

const clientRepository = AppDataSource.getRepository(Client);

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await clientRepository.find();

    if (!clients) {
      res.status(404).send({
        error: "Clients not found!!!",
      });
      return;
    }

    res.status(200).send(clients);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const getClient = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const client = await clientRepository.findOne({
      where: {
        id,
      },
    });

    if (!client) {
      res.status(404).send({
        error: "Client not found !!!",
      });
      return;
    }
    res.status(200).send(client);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const createClients = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const client = clientRepository.create(data);

    if (!client) {
      res.status(404).send({
        error: "Something wrong, please try again !!!",
      });
      return;
    }

    await clientRepository.save(data);

    res.status(201).send(client);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const updateClient = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body

  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "address", "phone"];


    const isMatch = updates.every((values) => allowedUpdates.includes(values));

    if (!isMatch) {
      res.status(404).send({
        error: "Invalid field to update",
      });
      return;
    }

    const client = await clientRepository.findOneBy({
      id,
    });

    if (!client) {
      res.status(404).send({
        error: "client not found !!!",
      });
      return;
    }

    Object.assign(client,data)

    await clientRepository.save(client)
   res.status(200).send(client)
  } catch (error) {
    if(error instanceof Error){
        res.status(500).send(error.message)
    }
  }
};

export const deleteClient = async(req:Request,res:Response) =>{

    const id = Number(req.params.id)

    try {
        const client = await clientRepository.findOneBy({
            id 
        })

        if(!client){
            res.status(404).send({
                error : 'Client not found !!!'
            })
            return
        }

        await clientRepository.delete(client.id)
        res.status(200).send('deleted successfull !!!')
    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}
