import { itemRepository, ListQuery } from "../item.repository";
import { ListItemsDto } from "./list-items.validation";

export async function listItems(dto: ListItemsDto) {
  return itemRepository.findAll(dto as ListQuery);
}
