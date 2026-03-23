import { itemRepository } from "../item.repository";
import { CreateItemDto } from "./create-item.validation";

export async function createItem(dto: CreateItemDto) {
  return itemRepository.create(dto);
}
