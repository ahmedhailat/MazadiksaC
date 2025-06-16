import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, Mail, TrendingUp, Trophy } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  auctionId?: number;
  isRead: boolean;
  emailSent: boolean;
  createdAt: string;
}

export function NotificationCenter({ userId = 1 }: { userId?: number }) {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/users', userId, 'notifications'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      return apiRequest(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'notifications'] });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bid_placed':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'bid_outbid':
        return <Bell className="h-4 w-4 text-orange-500" />;
      case 'auction_won':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'auction_ending':
        return <Mail className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'bid_placed':
        return 'bg-blue-50 border-blue-200';
      case 'bid_outbid':
        return 'bg-orange-50 border-orange-200';
      case 'auction_won':
        return 'bg-yellow-50 border-yellow-200';
      case 'auction_ending':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return <div className="p-6">Loading notifications...</div>;
  }

  return (
    <div className="w-full max-w-md" dir="rtl">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              الإشعارات
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-8">لا توجد إشعارات</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-colors ${
                  notification.isRead ? 'bg-white' : getNotificationColor(notification.type)
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString('ar-SA', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          disabled={markAsReadMutation.isPending}
                          className="h-6 px-2 text-xs"
                        >
                          <Check className="h-3 w-3" />
                          تم القراءة
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}