import { itemRepository } from "../item.repository";
import { UpdateItemDto } from "./update-item.validation";
import { ApiError } from "../../../utils/api-error";

export async function updateItem(id: string, dto: UpdateItemDto) {
  const item = await itemRepository.updateById(id, dto);
  if (!item) throw new ApiError(404, "Item not found");
  return item;
}
