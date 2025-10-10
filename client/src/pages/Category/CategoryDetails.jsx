import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RouteAddCategory, RouteEditCategory } from "@/helpers/RouteName";
import React, { useEffect, useState } from "react";
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
import Loading from "@/components/Loading";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { showToast } from "@/helpers/showToast";

const CategoryDetails = () => {
  const [refreshData,setRefreshData]=useState(false)

  const url = `${import.meta.env.VITE_URL}/category/all-category`;
  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(url, {
    method: "GET",
    // headers:{"Content-type":"application\json"},
    credentials: "include",
  },[refreshData]);

  const handleDelete = async (categoryID) => {
    const c = confirm("Are you sure you want to delete this category?");
    if (c) {
      try {
        const BASE_URL = `${
          import.meta.env.VITE_URL
        }/category/delete-category/${categoryID}`;
        const response = await fetch(BASE_URL, {
          method: "DELETE",
          credentials: "include",
        });

        
        const responseData = await response.json();

        if (!response.ok) {
          showToast("error", responseData.message);
          return;
        }

        showToast("success", responseData.message);
        setRefreshData((prev)=>!prev)
      } catch (error) {
        showToast("error", error.message  || "Failed to delete category");
      }
    }
  };

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
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            asChild
                            variant="outline"
                            className="cursor-pointer"
                            size="sm"
                          >
                            <Link to={RouteEditCategory(category._id)}>
                              <FaEdit />
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            className="cursor-pointer
                           "
                            size="sm"
                            onClick={() => handleDelete(category._id)}
                          >
                            <MdDelete />
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
