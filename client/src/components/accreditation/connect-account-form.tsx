import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { AccreditationBody } from "./accreditation-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Copy, ExternalLink, Lock } from "lucide-react";

const accountFormSchema = z.object({
  accreditationBody: z.string(),
  membershipId: z.string().min(5, "ID must be at least 5 characters"),
  apiKey: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface ConnectAccountFormProps {
  onConnect: (data: AccountFormValues) => Promise<void>;
  onCancel?: () => void;
}

export const ConnectAccountForm = ({ onConnect, onCancel }: ConnectAccountFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectSuccess, setConnectSuccess] = useState(false);
  
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      accreditationBody: "",
      membershipId: "",
      apiKey: "",
    },
  });

  const handleSubmit = async (data: AccountFormValues) => {
    setIsSubmitting(true);
    try {
      await onConnect(data);
      setConnectSuccess(true);
    } catch (error) {
      console.error("Failed to connect account:", error);
      form.setError("root", { 
        message: "Failed to connect to the selected accreditation body. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (connectSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Account Connected Successfully
          </CardTitle>
          <CardDescription>
            Your professional accreditation account has been linked successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>Your CPD credits will now sync automatically</AlertTitle>
            <AlertDescription>
              Courses and events completed on Book My Workshop will be automatically submitted to 
              your accreditation body for approval.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Professional Accreditation</CardTitle>
        <CardDescription>
          Link your professional accreditation account to automatically sync CPD credits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="accreditationBody"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accreditation Body</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an accreditation body" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CSP">Chartered Society of Physiotherapy (CSP)</SelectItem>
                      <SelectItem value="BASES">British Association of Sport and Exercise Sciences (BASES)</SelectItem>
                      <SelectItem value="HCPC">Health and Care Professions Council (HCPC)</SelectItem>
                      <SelectItem value="ACSM">American College of Sports Medicine (ACSM)</SelectItem>
                      <SelectItem value="ISSN">International Society of Sports Nutrition (ISSN)</SelectItem>
                      <SelectItem value="NSCA">National Strength and Conditioning Association (NSCA)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the professional body you're registered with
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="membershipId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership ID / Registration Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your ID number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your unique identification number with the accreditation body
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Access Key (Optional)</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="For automatic credit synchronization" 
                        {...field} 
                        className="flex-1"
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      className="ml-2"
                      onClick={() => {
                        navigator.clipboard.writeText(field.value || "");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription className="flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    Securely stored and used only for CPD credit verification
                  </FormDescription>
                  <div className="mt-2">
                    <Button 
                      type="button" 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-xs"
                    >
                      How to get your API key <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Connecting..." : "Connect Account"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectAccountForm;