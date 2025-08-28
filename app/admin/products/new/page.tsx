import { ProductForm } from "@/components/admin/product-form"
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function NewProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumbs 
        items={[
          { label: "Products", href: "/admin/products" },
          { label: "New Product" }
        ]} 
      />
      
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-500">Create a new product for your store</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <ProductForm 
          product={null} 
          onClose={() => window.history.back()} 
        />
      </div>
    </div>
  )
}
