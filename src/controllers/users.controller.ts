import type { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UsersController {
  constructor(private userService: UserService) {}

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
