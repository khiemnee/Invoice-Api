import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entity/User";
import * as brcypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {
  accessToken,
  refeshAccessToken,
} from "../helpers/generateToken.helper";
import { validator } from "../helpers/validator.helper";
import { refeshTokenKey } from "../secret";


const userRepository = AppDataSource.getRepository(User);

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, ...rest } = req.body;
    const hashedPassword = await brcypt.hash(password, 8);

    const newUser = userRepository.create({
      email,
      password: hashedPassword,
      ...rest,
    });

    const validatorResult = await validator(newUser)

    if(validatorResult !== null){
      res.status(400).json(validatorResult)
      return
    }

    await userRepository.save(newUser);

    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json(error.message);
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userExist = await userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    if (!userExist) {
      res.status(404).json({
        error: "user not exist !!!",
      });
      return;
    }

    const comparePassword = brcypt.compareSync(
      data.password,
      userExist.password
    );

    if (!comparePassword) {
      res.status(404).json({
        error: "Something wrong, please try again!!!",
      });
      return;
    }

    const token = await accessToken(userExist.id);
    const cookieTokenKey = await refeshAccessToken(userExist.id);

    res.cookie("cookieToken", cookieTokenKey, {
      httpOnly: true,
      sameSite: true,
      secure: true,
      maxAge: 604800000,
    });

    res.status(200).json({ userExist, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
  }
};

export const logOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("cookieToken", {
      httpOnly: true,
      sameSite: true,
      secure: true,
    });
    res.status(200).json("logOut sucessfull!!!");
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
  }
};

export const refeshToken = async (req: Request, res: Response) => {
  try {
    const refeshTokenCookie = req.cookies.cookieToken;


    if (!refeshTokenCookie) {
      res.status(401).json({ message: "No refresh token provided" });
      return;
    }

    const payload = jwt.verify(refeshTokenCookie, refeshTokenKey) as {
      id: number;
    };

    const token = await accessToken(payload.id);
    res.status(200).send({accessToken : token});
  } catch (error) {
    if (error instanceof Error) {
      res.status(403).json(error.message);
    }
  }
};
