import { createItem } from "../../api/items/create-item/create-item.service";
import { itemRepository } from "../../api/items/item.repository";

jest.mock("../../api/items/item.repository", () => ({
  itemRepository: {
    create: jest.fn(),
  },
}));

const mockCreate = itemRepository.create as jest.Mock;

const mockItem = {
  id: "uuid-1",
  name: "Widget",
  description: "A nice widget",
  price: 9.99,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("createItem service", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls repository.create with the dto and returns the created item", async () => {
    mockCreate.mockResolvedValue(mockItem);

    const dto = { name: "Widget", description: "A nice widget", price: 9.99 };
    const result = await createItem(dto);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockItem);
  });

  it("propagates repository errors", async () => {
    mockCreate.mockRejectedValue(new Error("DB error"));

    await expect(createItem({ name: "X", description: "Y", price: 1 })).rejects.toThrow("DB error");
  });
});
