"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Users, 
  TrendingUp, 
  AlertCircle,
  DollarSign,
  Eye
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AdminQuickActionsProps {
  stats?: {
    totalOrders: number
    lowStockItems: number
    pendingOrders: number
    revenue: number
  }
}

export function AdminQuickActions({ stats }: AdminQuickActionsProps) {
  const actions = [
    {
      title: "Process Orders",
      description: "Handle pending orders quickly",
      icon: ShoppingCart,
      color: "bg-blue-500 hover:bg-blue-600",
      count: stats?.pendingOrders || 0,
      href: "/admin/orders",
      onClick: () => toast({
        title: "Redirecting to Orders",
        description: "Opening order management panel..."
      })
    },
    {
      title: "Check Inventory", 
      description: "Review low stock alerts",
      icon: Package,
      color: "bg-orange-500 hover:bg-orange-600",
      count: stats?.lowStockItems || 0,
      href: "/admin/inventory",
      onClick: () => toast({
        title: "Inventory Check",
        description: `${stats?.lowStockItems || 0} items need restocking`
      })
    },
    {
      title: "View Analytics",
      description: "Check sales performance", 
      icon: BarChart3,
      color: "bg-green-500 hover:bg-green-600",
      href: "/admin/analytics",
      onClick: () => toast({
        title: "Analytics Dashboard",
        description: "Opening advanced analytics..."
      })
    },
    {
      title: "Manage Users",
      description: "User account management",
      icon: Users, 
      color: "bg-purple-500 hover:bg-purple-600",
      href: "/admin/users",
      onClick: () => toast({
        title: "User Management",
        description: "User management panel would open here"
      })
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          className={`h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-all ${action.color} hover:text-white group`}
          onClick={() => {
            action.onClick()
            // Navigate to the href if provided
            if (action.href) {
              setTimeout(() => window.location.href = action.href, 500)
            }
          }}
        >
          <div className="flex items-center justify-between w-full">
            <action.icon className="h-6 w-6" />
            {action.count !== undefined && action.count > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {action.count}
              </span>
            )}
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-sm">{action.title}</h3>
            <p className="text-xs opacity-75">{action.description}</p>
          </div>
        </Button>
      ))}
    </div>
  )
}
