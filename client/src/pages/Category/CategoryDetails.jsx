import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RouteAddCategory } from '@/helpers/RouteName'
import React from 'react'
import { Link } from 'react-router-dom'

const CategoryDetails = () => {
  return (
    <div>
      <Card>
        <CardHeader>
            <div >
                <Button asChild className='cursor-pointer'>
                 <Link to={RouteAddCategory}> 
                 Add Category
                 </Link>
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoryDetails
