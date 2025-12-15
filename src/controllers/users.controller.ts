import type { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { BadRequestError } from "../utils/errors";

export class UsersController {
  constructor(private userService: UserService) {}

  async getMyAccount(req: Request, res: Response) {
    try {
      if (!req.userId) {
        throw new BadRequestError("Invalid user id");
      }

      const user = await this.userService.getById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      console.error("❌ Error fetching my account:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await this.userService.getAll();

      // ? add filters ?

      if (!users) {
        return res.status(404).json({ message: "No users found" });
      }

      return res.json(users);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getbyId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await this.userService.getById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // first argument is used when binding the function
  async toggleUserActiveState(
    activeStatus: boolean,
    req: Request,
    res: Response
  ) {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // ? move to userService.setActiveState ?
      const user = await this.userService.getById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await this.userService.setActiveState(
        userId,
        activeStatus
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Error toggle user active state:", error.message);
      } else {
        console.error("❌ Unknown error:", error);
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
