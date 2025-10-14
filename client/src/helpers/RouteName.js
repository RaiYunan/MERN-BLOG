export const RouteIndex="/"
export const RouteSignIn="/sign-in"
export const RouteSignUp="/sign-up"
export const RouteProfile="/profile"
export const RouteCategoryDetails="/categories"
export const RouteAddCategory="/category/add"
export const RouteEditCategory=(category_id)=>{
    if(category_id){
        return `/category/edit/${category_id}`
    }else{
        return `/category/edit/:category_id`
    }

}
export const RouteBlog="/blog"
export const RouteBlogAdd="/blog/add"
export const RouteBlogEdit=(blogID)=>{
    if(blogID){
        return `/blog/edit/${blogID}`
    }
    return `/blog/edit/:blogID`
}
export const RouteBlogShow=(blogID)=>{
    if(blogID){
        return `/blog/show/${blogID}`
    }
    return `/blog/show/:blogID`
}