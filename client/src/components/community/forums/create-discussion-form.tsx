import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Image, Link2, AtSign, Paperclip, Send } from "lucide-react";
import { ForumCategory } from "@/lib/types";

const createDiscussionSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(150, { message: "Title cannot exceed 150 characters" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  forumId: z.string({ required_error: "Please select a forum category" }),
  tags: z.array(z.string()).optional(),
});

type CreateDiscussionForm = z.infer<typeof createDiscussionSchema>;

interface CreateDiscussionFormProps {
  onSubmit: (data: CreateDiscussionForm) => void;
  onCancel?: () => void;
}

const CreateDiscussionForm = ({ onSubmit, onCancel }: CreateDiscussionFormProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const { data: forums, isLoading: forumsLoading } = useQuery<ForumCategory[]>({
    queryKey: ['/api/community/categories'],
  });
  
  const { data: currentUser } = useQuery({
    queryKey: ['/api/users/current'],
  });
  
  const form = useForm<CreateDiscussionForm>({
    resolver: zodResolver(createDiscussionSchema),
    defaultValues: {
      title: "",
      content: "",
      forumId: "",
      tags: [],
    },
  });
  
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };
  
  const removeTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    form.setValue("tags", newTags);
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };
  
  const handleSubmit = (data: CreateDiscussionForm) => {
    data.tags = tags;
    onSubmit(data);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Discussion Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a descriptive title for your discussion" {...field} />
                  </FormControl>
                  <FormDescription>
                    Make your title specific and clear to attract the right audience
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Forum Category */}
            <FormField
              control={form.control}
              name="forumId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forum</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a forum category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {forumsLoading ? (
                        <SelectItem value="loading" disabled>Loading forums...</SelectItem>
                      ) : forums && forums.length > 0 ? (
                        forums.map(forum => (
                          <SelectItem key={forum.id} value={forum.id}>
                            {forum.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>No forums available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the most relevant category for your discussion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Discussion Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your thoughts, questions, or insights..." 
                      className="min-h-[200px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Tags */}
            <div>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1">
                    {tag}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add up to 5 tags (separate with Enter or comma)"
                  className="flex-1"
                />
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <FormDescription className="mt-1">
                Add relevant tags to help others find your discussion (max 5)
              </FormDescription>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="mr-2">
            <Image className="h-4 w-4 mr-1" />
            Add Image
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            <Link2 className="h-4 w-4 mr-1" />
            Add Link
          </Button>
          <Button variant="outline" size="sm">
            <Paperclip className="h-4 w-4 mr-1" />
            Attach
          </Button>
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
            <Send className="h-4 w-4 mr-1" />
            Post
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CreateDiscussionForm;