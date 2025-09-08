import { supabase } from "@/integrations/supabase/client";

export const checkAndCreateDemoUsers = async () => {
  const demoUsers = [
    {
      email: "john@university.edu",
      password: "student123",
      name: "John Doe",
      role: "student"
    },
    {
      email: "mike@university.edu", 
      password: "teacher123",
      name: "Mike Johnson",
      role: "teacher"
    },
    {
      email: "sarah@university.edu",
      password: "admin123",
      name: "Sarah Wilson", 
      role: "admin"
    }
  ];

  console.log("Checking and creating demo users if needed...");
  
  for (const user of demoUsers) {
    try {
      // First, let's check if this user already exists by trying to sign them in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password
      });
      
      if (signInError && signInError.message.includes("Invalid login credentials")) {
        // The user doesn't exist yet, so let's create their account
        console.log(`Creating demo user: ${user.email}`);
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              name: user.name,
              role: user.role
            }
          }
        });
        
        if (error) {
          console.log(`Error creating user ${user.email}:`, error.message);
        } else {
          console.log(`Created user: ${user.email} (${user.role})`);
        }
      } else if (!signInError) {
        console.log(`User ${user.email} already exists`);
        // Clean up by signing out after we've finished checking/creating users
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error);
    }
  }
  
  console.log("Demo user check completed!");
};

export const createDemoUsersDirectly = async () => {
  const demoUsers = [
    {
      email: "john@university.edu",
      password: "student123",
      name: "John Doe",
      role: "student"
    },
    {
      email: "mike@university.edu", 
      password: "teacher123",
      name: "Mike Johnson",
      role: "teacher"
    },
    {
      email: "sarah@university.edu",
      password: "admin123",
      name: "Sarah Wilson", 
      role: "admin"
    }
  ];

  console.log("Creating demo users...");
  
  for (const user of demoUsers) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name,
            role: user.role
          }
        }
      });
      
      if (error) {
        if (error.message.includes("already registered")) {
          console.log(`User ${user.email} already exists`);
        } else {
          console.log(`Error creating user ${user.email}:`, error.message);
        }
      } else {
        console.log(`Created user: ${user.email} (${user.role})`);
      }
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }
  
  console.log("Demo user creation completed!");
};
