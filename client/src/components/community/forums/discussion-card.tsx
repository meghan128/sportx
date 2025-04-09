import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MessageCircle, Heart, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";
import { Discussion } from "@/lib/types";

// We'll use inline type extension in the props instead
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DiscussionCardProps {
  discussion: Discussion & { liked?: boolean; bookmarked?: boolean };
  compact?: boolean;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
}

const DiscussionCard = ({ discussion, compact = false, onLike, onBookmark }: DiscussionCardProps) => {
  return (
    <Card className="hover:border-primary transition-colors">
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-start">
          <Avatar className={`${compact ? "h-8 w-8" : "h-10 w-10"} mr-3 mt-0.5`}>
            <AvatarImage src={discussion.author.profileImage} />
            <AvatarFallback>
              {discussion.author.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link href={`/community/discussions/${discussion.id}`}>
              <a className="hover:underline">
                <h4 className={`font-medium ${compact ? "text-sm" : "text-base"}`}>{discussion.title}</h4>
              </a>
            </Link>
            <div className={`flex items-center text-xs text-muted-foreground mt-1`}>
              <Link href={`/community/users/${discussion.author.id}`}>
                <a className="hover:underline font-medium text-gray-700 dark:text-gray-300 mr-1">
                  {discussion.author.name}
                </a>
              </Link>
              <span>in</span>
              <Link href={`/community/forums/${discussion.forum.toLowerCase().replace(/\s+/g, '-')}`}>
                <a className="hover:underline font-medium text-primary mx-1">
                  {discussion.forum}
                </a>
              </Link>
              <span>{discussion.timeAgo}</span>
            </div>
            {!compact && (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">{discussion.content}</p>
                {discussion.tags && discussion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {discussion.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className={`flex justify-between ${compact ? "px-3 py-2" : "px-4 py-2"} border-t`}>
        <div className="flex items-center space-x-4 text-muted-foreground">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
            <MessageCircle className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} mr-1`} />
            <span className="text-xs">{discussion.comments}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 px-2 text-muted-foreground hover:text-red-500 ${
              discussion.liked ? "text-red-500" : ""
            }`}
            onClick={() => onLike?.(discussion.id)}
          >
            <Heart className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} mr-1 ${
              discussion.liked ? "fill-red-500" : ""
            }`} />
            <span className="text-xs">{discussion.likes}</span>
          </Button>
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 w-8 p-0 ${
              discussion.bookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onBookmark?.(discussion.id)}
          >
            <Bookmark className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} ${
              discussion.bookmarked ? "fill-primary" : ""
            }`} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <Share2 className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Copy link</DropdownMenuItem>
              <DropdownMenuItem>Follow thread</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DiscussionCard;