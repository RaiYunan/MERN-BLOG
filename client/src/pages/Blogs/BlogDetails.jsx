import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";
import { RouteBlog, RouteBlogAdd } from "@/helpers/RouteName";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BlogDetails = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button asChild className="cursor-pointer">
              <Link to={RouteBlogAdd}>Add Blog</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Blog Title</TableHead>
                <TableHead>URL Slug</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetails;
