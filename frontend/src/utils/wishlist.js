const WISHLIST_STORAGE_KEY = "nexastore_wishlist";

export const getWishlistItems = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const isProductWishlisted = (productId) =>
  getWishlistItems().some((item) => item._id === productId);

export const toggleWishlistItem = (product) => {
  const items = getWishlistItems();
  const exists = items.some((item) => item._id === product._id);
  const next = exists
    ? items.filter((item) => item._id !== product._id)
    : [
        {
          _id: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          discount: product.discount || 0,
          category: product.category,
          rating: product.rating || 0,
          numReviews: product.numReviews || 0,
          countInStock: product.countInStock ?? 0,
        },
        ...items,
      ];
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("wishlist:updated"));
  return { added: !exists, items: next };
};

export const removeWishlistItem = (productId) => {
  const next = getWishlistItems().filter((item) => item._id !== productId);
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("wishlist:updated"));
  return next;
};
