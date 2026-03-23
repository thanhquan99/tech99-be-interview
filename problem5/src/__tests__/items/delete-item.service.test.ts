import { deleteItem } from "../../api/items/delete-item/delete-item.service";
import { itemRepository } from "../../api/items/item.repository";
import { ApiError } from "../../utils/api-error";

jest.mock("../../api/items/item.repository", () => ({
  itemRepository: {
    deleteById: jest.fn(),
  },
}));

const mockDeleteById = itemRepository.deleteById as jest.Mock;

const mockItem = {
  id: "uuid-1",
  name: "Widget",
  description: "A nice widget",
  price: 9.99,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("deleteItem service", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls repository.deleteById and resolves without returning a value", async () => {
    mockDeleteById.mockResolvedValue(mockItem);

    const result = await deleteItem("uuid-1");

    expect(mockDeleteById).toHaveBeenCalledWith("uuid-1");
    expect(result).toBeUndefined();
  });

  it("throws ApiError 404 when repository returns null", async () => {
    mockDeleteById.mockResolvedValue(null);

    await expect(deleteItem("nonexistent-id")).rejects.toThrow(ApiError);
    await expect(deleteItem("nonexistent-id")).rejects.toMatchObject({
      statusCode: 404,
      message: "Item not found",
    });
  });

  it("propagates repository errors", async () => {
    mockDeleteById.mockRejectedValue(new Error("DB error"));

    await expect(deleteItem("uuid-1")).rejects.toThrow("DB error");
  });
});
