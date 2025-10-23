import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import * as userService from "../user";
import { pick } from "../../utils";
import { ApiResponse } from "../../utils/apiResponse";

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.create(req.body);

  const resObj = pick(user, ["username", "email"]);

  res.status(201).json(
    new ApiResponse(
      true,
      {
        user: resObj,
      },
      "User registered successfully",
    ),
  );
});
