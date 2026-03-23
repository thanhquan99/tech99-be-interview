import { updateItem } from "../../api/items/update-item/update-item.service";
import { itemRepository } from "../../api/items/item.repository";
import { ApiError } from "../../utils/api-error";

jest.mock("../../api/items/item.repository", () => ({
  itemRepository: {
    updateById: jest.fn(),
  },
}));

const mockUpdateById = itemRepository.updateById as jest.Mock;

const mockItem = {
  id: "uuid-1",
  name: "Updated Widget",
  description: "Updated desc",
  price: 19.99,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("updateItem service", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns updated item when found", async () => {
    mockUpdateById.mockResolvedValue(mockItem);

    const dto = { name: "Updated Widget" };
    const result = await updateItem("uuid-1", dto);

    expect(mockUpdateById).toHaveBeenCalledWith("uuid-1", dto);
    expect(result).toEqual(mockItem);
  });

  it("can update price only", async () => {
    mockUpdateById.mockResolvedValue({ ...mockItem, price: 29.99 });

    const result = await updateItem("uuid-1", { price: 29.99 });

    expect(mockUpdateById).toHaveBeenCalledWith("uuid-1", { price: 29.99 });
    expect(result.price).toBe(29.99);
  });

  it("can update multiple fields at once", async () => {
    const updated = { ...mockItem, name: "New Name", description: "New Desc", price: 5 };
    mockUpdateById.mockResolvedValue(updated);

    const dto = { name: "New Name", description: "New Desc", price: 5 };
    const result = await updateItem("uuid-1", dto);

    expect(mockUpdateById).toHaveBeenCalledWith("uuid-1", dto);
    expect(result).toEqual(updated);
  });

  it("throws ApiError 404 when repository returns null", async () => {
    mockUpdateById.mockResolvedValue(null);

    await expect(updateItem("nonexistent-id", { name: "X" })).rejects.toThrow(ApiError);
    await expect(updateItem("nonexistent-id", { name: "X" })).rejects.toMatchObject({
      statusCode: 404,
      message: "Item not found",
    });
  });

  it("propagates repository errors", async () => {
    mockUpdateById.mockRejectedValue(new Error("DB error"));

    await expect(updateItem("uuid-1", { name: "X" })).rejects.toThrow("DB error");
  });
});
