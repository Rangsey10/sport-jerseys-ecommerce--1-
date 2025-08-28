"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ChevronLeft, 
  Plus, 
  Package, 
  Settings, 
  Bell, 
  Download,
  Upload,
  Users,
  BarChart3,
  FileText,
  RefreshCw,
  Eye
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AdminHeaderProps {
  title: string
  onRefresh?: () => void
}

export function AdminHeader({ title, onRefresh }: AdminHeaderProps) {
  const [notifications] = useState(3) // Mock notification count

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data export is being prepared...",
    })
  }

  const handleImport = () => {
    toast({
      title: "Import Data",
      description: "Please select a file to import",
    })
  }

  const handleSettings = () => {
    toast({
      title: "Admin Settings",
      description: "Settings panel would open here",
    })
  }

  return (
    <div className="flex items-center justify-between mb-8 p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/" title="View Store Front">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500">
            Manage your store efficiently • 
            <Link href="/" className="text-blue-600 hover:underline ml-1">
              View Store Front
            </Link>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notifications > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
              {notifications}
            </Badge>
          )}
        </Button>

        {/* Quick Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Quick Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Data Management</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImport}>
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Reports</DropdownMenuLabel>
            <DropdownMenuItem>
              <BarChart3 className="mr-2 h-4 w-4" />
              Sales Report
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              User Analytics
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              Inventory Report
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Store Management</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href="/" className="flex items-center w-full">
                <Eye className="mr-2 h-4 w-4" />
                View Store Front
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/products" className="flex items-center w-full">
                <Package className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Refresh Button */}
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}

        {/* Primary Action */}
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>
    </div>
  )
}
