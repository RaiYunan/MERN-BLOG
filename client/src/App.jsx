import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import {
  RouteAddCategory,
  RouteBlog,
  RouteBlogAdd,
  RouteBlogEdit,
  RouteBlogShow,
  RouteBlogShowByCategory,
  RouteBlogShowBySearch,
  RouteCategoryDetails,
  RouteEditCategory,
  RouteIndex,
  RouteProfile,
  RouteSignIn,
  RouteSignUp,
} from "./helpers/RouteName";
import Index from "./pages";
import SignIn from "./pages/Signin";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import AddCategory from "./pages/Category/AddCategory";
import CategoryDetails from "./pages/Category/CategoryDetails";
import EditCategory from "./pages/Category/EditCategory";
import BlogDetails from "./pages/Blogs/BlogDetails";
import AddBlog from "./pages/Blogs/AddBlog";
import EditBlog from "./pages/Blogs/EditBlog";
import ShowBlog from "./pages/Blogs/ShowBlog";
import BlogCardByCategory from "./components/BlogCardByCategory";
import SearchResult from "./pages/SearchResult";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RouteIndex} element={<Layout />}>
          <Route index element={<Index />} />
          <Route path={RouteProfile} element={<Profile />} />
          {/* blog catgeory */}
          <Route path={RouteAddCategory} element={<AddCategory />} />
          <Route path={RouteCategoryDetails} element={<CategoryDetails />} />
          <Route path={RouteEditCategory()} element={<EditCategory />} />
          {/* blog */}
          <Route path={RouteBlog} element={<BlogDetails />} />
          <Route path={RouteBlogAdd} element={<AddBlog/>}/>
          <Route path={RouteBlogEdit()} element={<EditBlog/>}/>
          <Route path={RouteBlogShow()} element={<ShowBlog/>}/>
          <Route path={RouteBlogShowByCategory()} element={<BlogCardByCategory/>}/>
          <Route path={RouteBlogShowBySearch()} element={<SearchResult/>}/>
        </Route>
        <Route path={RouteSignIn} element={<SignIn />} />
        <Route path={RouteSignUp} element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
