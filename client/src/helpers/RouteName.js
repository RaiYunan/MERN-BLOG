export const RouteIndex = "/";
export const RouteSignIn = "/sign-in";
export const RouteSignUp = "/sign-up";
export const RouteProfile = "/profile";
export const RouteCategoryDetails = "/categories";
export const RouteAddCategory = "/category/add";
export const RouteEditCategory = (category_id) => {
  if (category_id) {
    return `/category/edit/${category_id}`;
  } else {
    return `/category/edit/:category_id`;
  }
};
export const RouteBlog = "/blog";
export const RouteBlogAdd = "/blog/add";
export const RouteBlogEdit = (blogID) => {
  if (blogID) {
    return `/blog/edit/${blogID}`;
  }
  return `/blog/edit/:blogID`;
};

export const RouteBlogShow = (categorySlug, blogSlug) => {
  if (!categorySlug || !blogSlug) {
    return `/blog/:categorySlug/:blogSlug`;
  }
  return `/blog/${encodeURIComponent(categorySlug)}/${encodeURIComponent(
    blogSlug
  )}`;
};

export const RouteBlogShowByCategory = (categorySlug) => {
  if (!categorySlug) {
    return `/blog/:categorySlug`;
  }
  return `/blog/${encodeURIComponent(categorySlug)}`;
};

export const RouteBlogShowBySearch = (query) => {
  if(!query || query.trim() === ""){
    return `/search`
  }
  return `/search/?q=${encodeURIComponent(query)}`;
};

export const RouteShowComments="/blog/comments"

export const RouteShowUsers="/all-users"

export const RouteAccount="/account"
