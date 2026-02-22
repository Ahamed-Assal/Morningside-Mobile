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
const productCards = document.querySelectorAll(".phone-products-grid .product-card");
const productsEmptyState = document.querySelector("#products-empty-state");

if (productSearchInput && productFilterSelect && productPriceFilter && productCards.length > 0) {
  const updateProductFilters = () => {
    const searchTerm = productSearchInput.value.trim().toLowerCase();
    const selectedCategory = productFilterSelect.value;
    const selectedPriceRange = productPriceFilter.value;
    let visibleCount = 0;

    productCards.forEach((card) => {
      const cardText = card.textContent ? card.textContent.toLowerCase() : "";
      const cardCategories = card.getAttribute("data-category") || "";
      const priceValue = Number(card.getAttribute("data-price") || 0);
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
        card.classList.remove("is-hidden");
        visibleCount += 1;
        return;
      }

      card.classList.add("is-hidden");
    });

    if (productsEmptyState) {
      productsEmptyState.hidden = visibleCount > 0;
    }
  };

  productSearchInput.addEventListener("input", updateProductFilters);
  productFilterSelect.addEventListener("change", updateProductFilters);
  productPriceFilter.addEventListener("change", updateProductFilters);
}

const accessorySearchInput = document.querySelector("#accessory-search");
const accessoryCards = document.querySelectorAll(".accessories-products-grid .product-card");
const accessoriesEmptyState = document.querySelector("#accessories-empty-state");

if (accessorySearchInput && accessoryCards.length > 0) {
  const updateAccessorySearch = () => {
    const searchTerm = accessorySearchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    accessoryCards.forEach((card) => {
      const cardText = card.textContent ? card.textContent.toLowerCase() : "";
      const matches = cardText.includes(searchTerm);

      if (matches) {
        card.classList.remove("is-hidden");
        visibleCount += 1;
        return;
      }

      card.classList.add("is-hidden");
    });

    if (accessoriesEmptyState) {
      accessoriesEmptyState.hidden = visibleCount > 0;
    }
  };

  accessorySearchInput.addEventListener("input", updateAccessorySearch);
}

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
