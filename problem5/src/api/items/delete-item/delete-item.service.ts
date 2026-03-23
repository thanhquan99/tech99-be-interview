import { itemRepository } from "../item.repository";
import { ApiError } from "../../../utils/api-error";

export async function deleteItem(id: string) {
  const item = await itemRepository.deleteById(id);
  if (!item) throw new ApiError(404, "Item not found");
}
