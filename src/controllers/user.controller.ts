import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entity/User";

const userRepository = AppDataSource.getRepository(User);

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find();

    if (!users) {
      res.status(404).send({
        error: "Users not found",
      });
      return;
    }

    res.status(200).send(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const getUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const user = await userRepository.findOneBy({
      id,
    });

    if (!user) {
      res.status(404).send({
        error: "User not found",
      });
      return;
    }
    res.status(200).send(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;

  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password"];

    const isMatched = updates.every((values) =>
      allowedUpdates.includes(values)
    );

    if (!isMatched) {
      res.status(404).send({
        error: "invalid feild to update !!!",
      });
      return;
    }

    const user = await userRepository.findOneBy({
      id,
    });

    if (!user) {
      res.status(404).send({
        error: "user not found !!!",
      });
    }

    const userUpdated = Object.assign(user, data);
    await userRepository.save(user);
    res.status(200).send(userUpdated);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const user = await userRepository.findOneBy({
      id,
    });

    if (!user) {
      res.status(404).send({
        error: "Client not found !!!",
      });
      return;
    }

    await userRepository.delete(user.id);
    res.status(200).send("deleted successfull !!!");
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};
