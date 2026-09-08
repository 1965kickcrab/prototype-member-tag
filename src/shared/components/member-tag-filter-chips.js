import { createElement } from "../utils/dom.js";

const DEFAULT_CLOSE_ICON_PATH = "../assets/iconClose.svg";

export function createMemberTagFilterChips(options = {}) {
  const selectedTags = Array.isArray(options.selectedTags) ? options.selectedTags : [];
  const list = createElement("div", {
    className: "member-tag-filter-selected-chips",
    dataset: { area: "selectedMemberTagFilters", state: selectedTags.length ? "list" : "empty" },
  });

  selectedTags.forEach((memberTagName) => {
    const chip = createElement("span", {
      className: "member-tag-filter-selected-chip",
      dataset: { entity: "memberTag", entityId: memberTagName },
    });
    chip.append(createElement("span", { textContent: memberTagName }));

    const removeButton = createElement("button", {
      className: "member-tag-filter-chip-remove",
      type: "button",
      ariaLabel: `${memberTagName} 태그 선택 해제`,
      dataset: { action: "removeMemberTagFilter", entityId: memberTagName },
    });
    removeButton.append(createElement("img", {
      src: options.closeIconPath || DEFAULT_CLOSE_ICON_PATH,
      alt: "",
    }));
    removeButton.addEventListener("click", () => options.onRemove?.(memberTagName));
    chip.append(removeButton);
    list.append(chip);
  });

  return list;
}
