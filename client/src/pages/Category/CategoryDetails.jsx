import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RouteAddCategory } from "@/helpers/RouteName";
import React from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { useDispatch } from "react-redux";
import { setCatgeory } from "@/redux/category/category.slice.js";
import Loading from "@/components/Loading";

const CategoryDetails = () => {
  const dispatch = useDispatch();

  const url = `${import.meta.env.VITE_URL}/category/all-category`;
  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(url, {
    methods: "GET",
    // headers:{"Content-type":"application\json"},
    credentials: "include",
  });
  console.log("CatgeoryData", categoryData);
  // dispatch(setCatgeory(categoryData.data))//array of objects

  if (loading) return <Loading />;
  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button asChild className="cursor-pointer">
              <Link to={RouteAddCategory}>Add Category</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>URL Slug</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categoryData && categoryData.length > 0 ? (
                categoryData.map((category) => {
                  return (
                    <TableRow key={category._id}>
                      <TableHead>{category.name}</TableHead>
                      <TableHead>{category.slug}</TableHead>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" className="cursor-pointer" size="sm">
                            Edit
                          </Button>
                          <Button variant="destructive"
                          className="cursor-pointer" size="sm">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground pt-8"
                  >
                    No categories available. Create your first category!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryDetails;
