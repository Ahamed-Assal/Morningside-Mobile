const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#nav-menu");

if (menuToggle && navMenu) {
  const navLinks = navMenu.querySelectorAll("a");

  const closeMenu = () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  };

  const openMenu = () => {
    navMenu.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("open");
    if (isOpen) {
      closeMenu();
      return;
    }
    openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!navMenu.classList.contains("open")) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    const clickedInsideMenu = navMenu.contains(target);
    const clickedToggle = menuToggle.contains(target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

const productSearchInput = document.querySelector("#product-search");
const productFilterSelect = document.querySelector("#product-filter");
const productPriceFilter = document.querySelector("#price-filter");
const productPriceSort = document.querySelector("#price-sort");
const phoneProductsGrid = document.querySelector(".phone-products-grid");
const productCards = Array.from(document.querySelectorAll(".phone-products-grid .product-card"));
const productsEmptyState = document.querySelector("#products-empty-state");
const showMorePhonesButton = document.querySelector("#show-more-phones");
let phonesExpanded = false;
const productOriginalOrder = new Map(
  productCards.map((card, index) => [card, index])
);

const getCardDisplayPrice = (card) => {
  const priceElement = card.querySelector(".product-price");
  const priceText = priceElement ? priceElement.textContent || "" : "";
  const matchedValue = priceText.match(/[\d,.]+/);

  if (matchedValue) {
    return Number(matchedValue[0].replace(/,/g, ""));
  }

  return Number(card.getAttribute("data-price") || 0);
};

const getTwoRowLimit = (gridElement) => {
  if (!gridElement) {
    return 6;
  }

  const gridTemplate = window.getComputedStyle(gridElement).gridTemplateColumns;
  const columnCount = gridTemplate
    .split(" ")
    .map((value) => value.trim())
    .filter(Boolean).length;

  return Math.max(columnCount, 1) * 2;
};

const productDescriptionSelector =
  ".phone-products-grid .product-content p:not(.product-price), .accessories-products-grid .product-content p:not(.product-price), .top-deals-section .products-grid .product-content p:not(.product-price)";

const refreshProductDescriptionToggles = () => {
  const descriptions = document.querySelectorAll(productDescriptionSelector);

  descriptions.forEach((description) => {
    description.classList.add("product-description");
    const parent = description.parentElement;
    if (!parent) {
      return;
    }

    const existingToggle =
      description.nextElementSibling instanceof HTMLElement &&
      description.nextElementSibling.classList.contains("details-toggle")
        ? description.nextElementSibling
        : null;

    const isHidden = description.offsetParent === null;
    const needsToggle = isHidden
      ? description.textContent.trim().length > 70
      : description.scrollHeight > description.clientHeight + 1;

    if (!needsToggle) {
      description.classList.remove("is-expanded");
      if (existingToggle) {
        existingToggle.remove();
      }
      return;
    }

    if (existingToggle) {
      existingToggle.textContent = description.classList.contains("is-expanded")
        ? "Show less"
        : "Read more";
      return;
    }

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "details-toggle";
    toggleButton.textContent = "Read more";

    toggleButton.addEventListener("click", () => {
      const isExpanded = description.classList.toggle("is-expanded");
      toggleButton.textContent = isExpanded ? "Show less" : "Read more";
    });

    parent.insertBefore(toggleButton, description.nextSibling);
  });
};

if (
  productSearchInput &&
  productFilterSelect &&
  productPriceFilter &&
  productPriceSort &&
  productCards.length > 0 &&
  phoneProductsGrid
) {
  const updateProductFilters = () => {
    const searchTerm = productSearchInput.value.trim().toLowerCase();
    const selectedCategory = productFilterSelect.value;
    const selectedPriceRange = productPriceFilter.value;
    const selectedPriceSort = productPriceSort.value;
    const matchedCards = [];

    productCards.forEach((card) => {
      const cardText = card.textContent ? card.textContent.toLowerCase() : "";
      const cardCategories = card.getAttribute("data-category") || "";
      const priceValue = getCardDisplayPrice(card);
      const matchesSearch = cardText.includes(searchTerm);
      const matchesCategory =
        selectedCategory === "all" || cardCategories.includes(selectedCategory);
      let matchesPrice = true;

      if (selectedPriceRange !== "all") {
        if (selectedPriceRange === "under500") {
          matchesPrice = priceValue < 500;
        } else if (selectedPriceRange === "500to1000") {
          matchesPrice = priceValue >= 500 && priceValue <= 1000;
        } else if (selectedPriceRange === "1000plus") {
          matchesPrice = priceValue > 1000;
        }
      }

      if (matchesSearch && matchesCategory && matchesPrice) {
        matchedCards.push(card);
        return;
      }

      card.classList.add("is-hidden");
    });

    if (selectedPriceSort === "lowtohigh") {
      matchedCards.sort((a, b) => getCardDisplayPrice(a) - getCardDisplayPrice(b));
    } else if (selectedPriceSort === "hightolow") {
      matchedCards.sort((a, b) => getCardDisplayPrice(b) - getCardDisplayPrice(a));
    } else {
      matchedCards.sort(
        (a, b) => (productOriginalOrder.get(a) ?? 0) - (productOriginalOrder.get(b) ?? 0)
      );
    }

    matchedCards.forEach((card) => {
      phoneProductsGrid.appendChild(card);
    });

    const visibleLimit = getTwoRowLimit(phoneProductsGrid);
    const shouldCollapse = !phonesExpanded && matchedCards.length > visibleLimit;

    matchedCards.forEach((card, index) => {
      const hideCard = shouldCollapse && index >= visibleLimit;
      card.classList.toggle("is-hidden", hideCard);
    });

    if (productsEmptyState) {
      productsEmptyState.hidden = matchedCards.length > 0;
    }

    if (showMorePhonesButton) {
      const canTogglePhones = matchedCards.length > visibleLimit;
      showMorePhonesButton.hidden = matchedCards.length === 0 || !canTogglePhones;
      showMorePhonesButton.textContent = phonesExpanded ? "Show Less Phones" : "Show More Phones";
    }

    refreshProductDescriptionToggles();
  };

  productSearchInput.addEventListener("input", updateProductFilters);
  productFilterSelect.addEventListener("change", updateProductFilters);
  productPriceFilter.addEventListener("change", updateProductFilters);
  productPriceSort.addEventListener("change", updateProductFilters);

  if (showMorePhonesButton) {
    showMorePhonesButton.addEventListener("click", () => {
      phonesExpanded = !phonesExpanded;
      updateProductFilters();
    });
  }

  window.addEventListener("resize", updateProductFilters);
  updateProductFilters();
}

const accessorySearchInput = document.querySelector("#accessory-search");
const accessoriesProductsGrid = document.querySelector(".accessories-products-grid");
const accessoryCards = Array.from(document.querySelectorAll(".accessories-products-grid .product-card"));
const accessoriesEmptyState = document.querySelector("#accessories-empty-state");
const showMoreAccessoriesButton = document.querySelector("#show-more-accessories");
let accessoriesExpanded = false;

if (accessorySearchInput && accessoryCards.length > 0 && accessoriesProductsGrid) {
  const updateAccessorySearch = () => {
    const searchTerm = accessorySearchInput.value.trim().toLowerCase();
    const matchedCards = [];

    accessoryCards.forEach((card) => {
      const cardText = card.textContent ? card.textContent.toLowerCase() : "";
      const matches = cardText.includes(searchTerm);

      if (matches) {
        matchedCards.push(card);
        return;
      }

      card.classList.add("is-hidden");
    });

    const visibleLimit = getTwoRowLimit(accessoriesProductsGrid);
    const shouldCollapse = !accessoriesExpanded && matchedCards.length > visibleLimit;

    matchedCards.forEach((card, index) => {
      const hideCard = shouldCollapse && index >= visibleLimit;
      card.classList.toggle("is-hidden", hideCard);
    });

    if (accessoriesEmptyState) {
      accessoriesEmptyState.hidden = matchedCards.length > 0;
    }

    if (showMoreAccessoriesButton) {
      const canToggleAccessories = matchedCards.length > visibleLimit;
      showMoreAccessoriesButton.hidden = matchedCards.length === 0 || !canToggleAccessories;
      showMoreAccessoriesButton.textContent = accessoriesExpanded
        ? "Show Less Accessories"
        : "Show More Accessories";
    }

    refreshProductDescriptionToggles();
  };

  accessorySearchInput.addEventListener("input", updateAccessorySearch);

  if (showMoreAccessoriesButton) {
    showMoreAccessoriesButton.addEventListener("click", () => {
      accessoriesExpanded = !accessoriesExpanded;
      updateAccessorySearch();
    });
  }

  window.addEventListener("resize", updateAccessorySearch);
  updateAccessorySearch();
}

window.addEventListener("resize", refreshProductDescriptionToggles);
window.requestAnimationFrame(refreshProductDescriptionToggles);

const formSuccessAlert = document.querySelector("#form-success-alert");

if (formSuccessAlert) {
  const currentUrl = new URL(window.location.href);
  const isSuccess = currentUrl.searchParams.get("success") === "true";

  if (isSuccess) {
    formSuccessAlert.hidden = false;
    currentUrl.searchParams.delete("success");
    window.history.replaceState({}, "", currentUrl.toString());
  }
}

const contactForm = document.querySelector(".contact-form");

if (contactForm && formSuccessAlert) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : "";
    const formData = new FormData(contactForm);

    formSuccessAlert.hidden = true;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send contact form.");
      }

      formSuccessAlert.hidden = false;
      contactForm.reset();
    } catch (error) {
      console.error(error);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
