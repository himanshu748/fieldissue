export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
export const notFound = () =>
  new AppError("NOT_FOUND", 404, "Issue or observation not found");
