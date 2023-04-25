export const HttpStatusCode = {
  InternalServerError: 500,
  NotFound: 404,
  OK: 200
}

export function errorResponse(res, status, message) {
  res.status(status).json({ message })
}
