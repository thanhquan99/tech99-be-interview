// Mock @prisma/client so tests don't need a real DB connection
export class PrismaClient {
  item = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };
}

export const Prisma = {
  PrismaClientKnownRequestError: class extends Error {
    code: string;
    constructor(message: string, { code }: { code: string }) {
      super(message);
      this.code = code;
    }
  },
};
