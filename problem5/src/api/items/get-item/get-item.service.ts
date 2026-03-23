import { itemRepository } from "../item.repository";
import { ApiError } from "../../../utils/api-error";

export async function getItem(id: string) {
  const item = await itemRepository.findById(id);
  if (!item) throw new ApiError(404, "Item not found");
  return item;
}
