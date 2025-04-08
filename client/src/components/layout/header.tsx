import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full hover:bg-gray-100 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 bg-destructive text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback>{isLoading ? 'UK' : user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-sm font-medium">
                {isLoading ? 'User' : user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
