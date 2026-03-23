import { getItem } from "../../api/items/get-item/get-item.service";
import { itemRepository } from "../../api/items/item.repository";
import { ApiError } from "../../utils/api-error";

jest.mock("../../api/items/item.repository", () => ({
  itemRepository: {
    findById: jest.fn(),
  },
}));

const mockFindById = itemRepository.findById as jest.Mock;

const mockItem = {
  id: "uuid-1",
  name: "Widget",
  description: "A nice widget",
  price: 9.99,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("getItem service", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns item when found", async () => {
    mockFindById.mockResolvedValue(mockItem);

    const result = await getItem("uuid-1");

    expect(mockFindById).toHaveBeenCalledWith("uuid-1");
    expect(result).toEqual(mockItem);
  });

  it("throws ApiError 404 when item does not exist", async () => {
    mockFindById.mockResolvedValue(null);

    await expect(getItem("nonexistent-id")).rejects.toThrow(ApiError);
    await expect(getItem("nonexistent-id")).rejects.toMatchObject({
      statusCode: 404,
      message: "Item not found",
    });
  });

  it("propagates repository errors", async () => {
    mockFindById.mockRejectedValue(new Error("DB error"));

    await expect(getItem("uuid-1")).rejects.toThrow("DB error");
  });
});
