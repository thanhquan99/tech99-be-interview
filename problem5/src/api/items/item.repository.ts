import { Prisma } from "@prisma/client";
import prisma from "../../config/db";

export interface ListQuery {
  name?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const itemRepository = {
  async create(data: Prisma.ItemCreateInput) {
    return prisma.item.create({ data });
  },

  async findAll(query: ListQuery) {
    const { name, sortBy = "createdAt", order = "desc", page = 1, limit = 10 } = query;

    const where: Prisma.ItemWhereInput = name
      ? { name: { contains: name, mode: "insensitive" } }
      : {};

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      prisma.item.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  async findById(id: string) {
    return prisma.item.findUnique({ where: { id } });
  },

  async updateById(id: string, data: Prisma.ItemUpdateInput) {
    return prisma.item.update({ where: { id }, data });
  },

  async deleteById(id: string) {
    return prisma.item.delete({ where: { id } });
  },
};
