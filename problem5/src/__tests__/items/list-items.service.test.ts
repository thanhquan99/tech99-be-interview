import { listItems } from "../../api/items/list-items/list-items.service";
import { itemRepository } from "../../api/items/item.repository";

jest.mock("../../api/items/item.repository", () => ({
  itemRepository: {
    findAll: jest.fn(),
  },
}));

const mockFindAll = itemRepository.findAll as jest.Mock;

const makeItem = (id: string) => ({
  id,
  name: `Item ${id}`,
  description: "desc",
  price: 1.0,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("listItems service", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns paginated results with default query", async () => {
    const mockResult = { items: [makeItem("1")], total: 1, page: 1, limit: 10 };
    mockFindAll.mockResolvedValue(mockResult);

    const result = await listItems({});

    expect(mockFindAll).toHaveBeenCalledWith({});
    expect(result).toEqual(mockResult);
  });

  it("passes name filter to repository", async () => {
    const mockResult = { items: [makeItem("2")], total: 1, page: 1, limit: 10 };
    mockFindAll.mockResolvedValue(mockResult);

    const result = await listItems({ name: "Item" });

    expect(mockFindAll).toHaveBeenCalledWith({ name: "Item" });
    expect(result).toEqual(mockResult);
  });

  it("passes sorting and pagination params to repository", async () => {
    const mockResult = { items: [], total: 0, page: 2, limit: 5 };
    mockFindAll.mockResolvedValue(mockResult);

    const result = await listItems({ sortBy: "name", order: "asc", page: 2, limit: 5 });

    expect(mockFindAll).toHaveBeenCalledWith({ sortBy: "name", order: "asc", page: 2, limit: 5 });
    expect(result).toEqual(mockResult);
  });

  it("returns empty list when no items match", async () => {
    const mockResult = { items: [], total: 0, page: 1, limit: 10 };
    mockFindAll.mockResolvedValue(mockResult);

    const result = await listItems({ name: "nonexistent" });

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("propagates repository errors", async () => {
    mockFindAll.mockRejectedValue(new Error("DB error"));

    await expect(listItems({})).rejects.toThrow("DB error");
  });
});
