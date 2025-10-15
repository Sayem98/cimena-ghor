export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;

  /**
   * Creates an API response object.
   * @param success - Indicates whether the request was successful.
   * @param message - A descriptive message about the response.
   * @param data - The payload data (optional).
   */
  constructor(success: boolean, data: T, message: string) {
    this.success = success;
    this.message = message;
    if (data !== undefined) this.data = data;
  }

  /**
   * Creates a success response.
   * @param data - The payload data.
   * @param message - A descriptive success message.
   * @returns An `ApiResponse` instance.
   */
  static success<T>(
    data: T,
    message: string = "Operation successful"
  ): ApiResponse<T> {
    return new ApiResponse<T>(true, data, message);
  }
}
