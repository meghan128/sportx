import { Bell, Search, Calendar, CheckCircle2, BadgePlus, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import GlobalSearch from "@/components/navigation/global-search";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });

  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-1 flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">{title}</h2>

            <div className="hidden md:block">
              <GlobalSearch />
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600 hover:text-primary"
                onClick={() => setShowSearchBar(!showSearchBar)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem className="py-3 px-4 cursor-pointer flex flex-col items-start">
                    <div className="flex items-start gap-3 w-full">
                      <span className="bg-blue-100 p-1.5 rounded-full text-blue-600 mt-0.5">
                        <Calendar className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Event Reminder</p>
                        <p className="text-xs text-gray-500 mt-0.5">Sports Injury Workshop starts in 2 days</p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline" className="text-xs font-normal">2 days ago</Badge>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">View</Button>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="py-3 px-4 cursor-pointer flex flex-col items-start">
                    <div className="flex items-start gap-3 w-full">
                      <span className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">CPD Points Updated</p>
                        <p className="text-xs text-gray-500 mt-0.5">You've earned 5 new CPD points from recently completed course</p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline" className="text-xs font-normal">5 hours ago</Badge>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">View</Button>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="py-3 px-4 cursor-pointer flex flex-col items-start">
                    <div className="flex items-start gap-3 w-full">
                      <span className="bg-purple-100 p-1.5 rounded-full text-purple-600 mt-0.5">
                        <BadgePlus className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Accreditation Update</p>
                        <p className="text-xs text-gray-500 mt-0.5">Your BASES accreditation is awaiting verification</p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline" className="text-xs font-normal">1 day ago</Badge>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">Review</Button>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <Button variant="ghost" size="sm" className="w-full text-xs h-8">View all notifications</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 rounded-full hover:bg-gray-50 transition-colors cursor-pointer py-1 px-2">
                  <Avatar>
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback>{isLoading ? 'UK' : user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block text-sm font-medium">
                    {isLoading ? 'User' : user?.name}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-sm">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">{user?.name || 'User'}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                    {user?.role && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full w-fit">
                        {user.role === 'resource_person' ? 'Resource Person' : 'User'}
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>My CPD Record</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearchBar && (
        <div className="md:hidden border-t border-gray-100 p-4">
          <GlobalSearch />
        </div>
      )}
    </header>
  );
};

export default Header;