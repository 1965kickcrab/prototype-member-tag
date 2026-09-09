import { createElement } from "../utils/dom.js";
import { sanitizeTagList } from "../services/member-tag-service.js";

export function renderMemberTagChips(container, tags, options = {}) {
  container.innerHTML = "";
  const visibleCount = Number.isFinite(options.maxVisible) ? options.maxVisible : Infinity;
  const memberTags = sanitizeTagList(tags);
  const visibleTags = memberTags.slice(0, visibleCount);

  visibleTags.forEach((memberTagName) => {
    const chip = createElement("span", {
      className: options.className || "member-tag-input-chip",
      textContent: memberTagName,
      dataset: {
        entity: "memberTag",
        entityId: memberTagName,
      },
    });
    container.append(chip);
  });

  if (memberTags.length > visibleTags.length) {
    container.append(createElement("span", {
      className: options.className || "member-tag-input-chip",
      textContent: `+${memberTags.length - visibleTags.length}`,
      dataset: { entity: "memberTagOverflow" },
    }));
  }

  container.dataset.state = memberTags.length ? "list" : "empty";

  if (options.maxHeight && memberTags.length) {
    collapseMemberTagChips(container, options.maxHeight);
  }

  return container;
}

function collapseMemberTagChips(container, maxHeight) {
  window.requestAnimationFrame(() => {
    const chips = Array.from(container.querySelectorAll("[data-entity='memberTag']"));
    const containerTop = container.getBoundingClientRect().top;
    const getBottom = (element) => element.getBoundingClientRect().bottom - containerTop;
    const visibleChips = chips.filter((chip) => getBottom(chip) <= maxHeight);

    if (visibleChips.length === chips.length) {
      return;
    }

    let visibleCount = visibleChips.length;
    const overflowButton = createElement("button", {
      className: "member-tag-overflow-button",
      type: "button",
      dataset: { action: "expandMemberTagChips", state: "collapsed" },
      ariaLabel: "숨겨진 태그 더 보기",
    });

    const renderCollapsedChips = () => {
      container.replaceChildren(...chips.slice(0, visibleCount), overflowButton);
      overflowButton.textContent = `+${chips.length - visibleCount}`;
    };

    container.style.maxHeight = `${maxHeight}px`;
    container.style.overflow = "hidden";
    renderCollapsedChips();

    while (getBottom(overflowButton) > maxHeight && visibleCount > 0) {
      visibleCount -= 1;
      renderCollapsedChips();
    }

    overflowButton.addEventListener("click", () => {
      container.replaceChildren(...chips);
      container.style.maxHeight = "";
      container.style.overflow = "";
      container.dataset.state = "expanded";
    });
    container.dataset.state = "collapsed";
  });
}
