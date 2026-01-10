import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";

export class UsersController {
  constructor(private userService: UserService) {}

  async getMyAccount(req: Request, res: Response) {
    if (!req.userId) {
      throw new BadRequestError("Invalid user id");
    }

    const user = await this.userService.getById(req.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return res.json(user);
  }

  async getAll(req: Request, res: Response) {
    const users = await this.userService.getAll();

    // ? add filters ?

    if (!users) {
      throw new NotFoundError("No users found");
    }

    return res.json(users);
  }

  async getbyId(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      throw new BadRequestError("Invalid user ID");
    }

    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return res.json(user);
  }

  // first argument is used when binding the function
  async toggleUserActiveState(
    activeStatus: boolean,
    req: Request,
    res: Response
  ) {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      throw new BadRequestError("Invalid user ID");
    }

    // ? move to userService.setActiveState ?
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await this.userService.setActiveState(
      userId,
      activeStatus
    );

    return res.status(200).json(updatedUser);
  }
}
