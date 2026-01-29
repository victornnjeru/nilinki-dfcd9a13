import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Music2, Eye, EyeOff, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { genres } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";

const baseSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
});

const bandSchema = baseSchema.extend({
  role: z.literal("band"),
  bandName: z
    .string()
    .trim()
    .min(1, { message: "Band name is required" })
    .max(100, { message: "Band name must be less than 100 characters" }),
  genre: z.string().min(1, { message: "Please select a genre" }),
  location: z
    .string()
    .trim()
    .min(1, { message: "Location is required" })
    .max(100, { message: "Location must be less than 100 characters" }),
  bio: z
    .string()
    .trim()
    .max(500, { message: "Bio must be less than 500 characters" })
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const clientSchema = baseSchema.extend({
  role: z.literal("client"),
  fullName: z
    .string()
    .trim()
    .min(1, { message: "Full name is required" })
    .max(100, { message: "Full name must be less than 100 characters" }),
  company: z
    .string()
    .trim()
    .max(100, { message: "Company name must be less than 100 characters" })
    .optional(),
  phone: z
    .string()
    .trim()
    .max(20, { message: "Phone must be less than 20 characters" })
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RoleType = "band" | "client";

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  const bandForm = useForm<z.infer<typeof bandSchema>>({
    resolver: zodResolver(bandSchema),
    defaultValues: {
      role: "band",
      email: "",
      password: "",
      confirmPassword: "",
      bandName: "",
      genre: "",
      location: "",
      bio: "",
    },
  });

  const clientForm = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      role: "client",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      company: "",
      phone: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof bandSchema> | z.infer<typeof clientSchema>) => {
    setIsLoading(true);
    
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: data.role === "band" ? data.bandName : data.fullName,
          },
        },
      });

      if (authError) {
        toast({
          title: "Sign Up Failed",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (!authData.user) {
        toast({
          title: "Sign Up Failed",
          description: "Unable to create account. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Insert user role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: authData.user.id, role: data.role });

      if (roleError) {
        // Log only in development mode to avoid exposing internal details
        if (import.meta.env.DEV) {
          console.error("Role insert error:", roleError);
        }
        // Continue anyway - role can be added later by admin if needed
      }

      // Insert role-specific data
      if (data.role === "band") {
        const bandData = data as z.infer<typeof bandSchema>;
        const { error: bandError } = await supabase.from("bands").insert({
          user_id: authData.user.id,
          name: bandData.bandName,
          genre: bandData.genre,
          location: bandData.location,
          bio: bandData.bio || null,
        });

        if (bandError) {
          // Log only in development mode to avoid exposing internal details
          if (import.meta.env.DEV) {
            console.error("Band insert error:", bandError);
          }
          toast({
            title: "Warning",
            description: "Account created but band profile setup failed. You can complete this later.",
            variant: "destructive",
          });
        }
      } else {
        const clientData = data as z.infer<typeof clientSchema>;
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: clientData.fullName,
            company: clientData.company || null,
            phone: clientData.phone || null,
          })
          .eq("user_id", authData.user.id);

        if (profileError) {
          // Log only in development mode to avoid exposing internal details
          if (import.meta.env.DEV) {
            console.error("Profile update error:", profileError);
          }
          // Profile is auto-created by trigger, update might fail if trigger hasn't run yet
        }
      }

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/login");
    } catch (error) {
      // Log only in development mode to avoid exposing internal details
      if (import.meta.env.DEV) {
        console.error("Signup error:", error);
      }
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleCards = [
    {
      id: "band" as const,
      title: "I'm a Band",
      description: "Showcase your music and get booked for events",
      icon: Music2,
    },
    {
      id: "client" as const,
      title: "I'm an Event Planner",
      description: "Find and book amazing bands for your events",
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-background to-background items-center justify-center p-12">
        <div className="max-w-md text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Music2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="font-display text-3xl font-bold text-foreground">
              Nilinki
            </span>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Join Our Community
          </h1>
          <p className="text-lg text-muted-foreground">
            Whether you're a band looking to get discovered or an event planner searching for the perfect act.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Music2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold text-foreground">
                Nilinki
              </span>
            </Link>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="text-muted-foreground">
              {selectedRole ? "Fill in your details to get started" : "Choose how you'll use Nilinki"}
            </p>
          </div>

          {/* Role Selection */}
          {!selectedRole && (
            <div className="space-y-4">
              {roleCards.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    "w-full p-6 rounded-lg border-2 text-left transition-all",
                    "hover:border-primary hover:bg-primary/5",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "border-border bg-card"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <role.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {role.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Band Sign Up Form */}
          {selectedRole === "band" && (
            <Form {...bandForm}>
              <form onSubmit={bandForm.handleSubmit(handleSubmit)} className="space-y-5">
                <Button
                  type="button"
                  variant="ghost"
                  className="mb-2 -ml-2"
                  onClick={() => setSelectedRole(null)}
                >
                  ← Back to role selection
                </Button>

                <FormField
                  control={bandForm.control}
                  name="bandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Band Name</FormLabel>
                      <FormControl>
                        <Input placeholder="The Midnight Echoes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={bandForm.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genres.map((genre) => (
                              <SelectItem key={genre.id} value={genre.id}>
                                {genre.icon} {genre.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bandForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="New York, USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={bandForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your band..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bandForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="band@example.com" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bandForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Min 8 characters with uppercase, lowercase, and number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bandForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Band Account"}
                </Button>
              </form>
            </Form>
          )}

          {/* Client Sign Up Form */}
          {selectedRole === "client" && (
            <Form {...clientForm}>
              <form onSubmit={clientForm.handleSubmit(handleSubmit)} className="space-y-5">
                <Button
                  type="button"
                  variant="ghost"
                  className="mb-2 -ml-2"
                  onClick={() => setSelectedRole(null)}
                >
                  ← Back to role selection
                </Button>

                <FormField
                  control={clientForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" autoComplete="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={clientForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Event Co." autoComplete="organization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={clientForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 234 567 890" autoComplete="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={clientForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={clientForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Min 8 characters with uppercase, lowercase, and number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={clientForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          )}

          <div className="text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
