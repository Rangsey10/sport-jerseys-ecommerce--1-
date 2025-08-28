"use client"

import { Button } from "@/components/ui/button"
import { 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal, 
  Copy, 
  Archive, 
  Star,
  Share,
  Download
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

interface AdminTableActionsProps {
  itemId: string
  itemName: string
  type: "order" | "product" | "user"
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export function AdminTableActions({ 
  itemId, 
  itemName, 
  type, 
  onEdit, 
  onDelete, 
  onView 
}: AdminTableActionsProps) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(itemId)
    } else {
      toast({
        title: `Edit ${type}`,
        description: `Editing ${itemName}...`
      })
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(itemId)
    } else {
      toast({
        title: "Confirm Delete",
        description: `Are you sure you want to delete ${itemName}?`,
        variant: "destructive"
      })
    }
  }

  const handleView = () => {
    if (onView) {
      onView(itemId)
    } else {
      toast({
        title: `View ${type}`,
        description: `Opening ${itemName} details...`
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(itemId)
    toast({
      title: "ID Copied",
      description: `${type} ID copied to clipboard`
    })
  }

  const handleArchive = () => {
    toast({
      title: `Archive ${type}`,
      description: `${itemName} has been archived`
    })
  }

  const handleShare = () => {
    toast({
      title: `Share ${type}`,
      description: `Share link for ${itemName} copied to clipboard`
    })
  }

  return (
    <div className="flex items-center gap-1">
      {/* Quick Actions */}
      <Button variant="ghost" size="sm" onClick={handleView} title={`View ${itemName}`}>
        <Eye className="h-4 w-4" />
      </Button>
      
      <Button variant="ghost" size="sm" onClick={handleEdit} title={`Edit ${itemName}`}>
        <Edit className="h-4 w-4" />
      </Button>

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {type === "product" && (
            <>
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                Feature Product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" />
                Share Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {type === "order" && (
            <>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handleArchive}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
