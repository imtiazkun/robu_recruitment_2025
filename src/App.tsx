"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  id: z.string().min(8).max(10),
  phone: z.string().min(2).max(11),
  gender: z.string(),
  email: z.string().email(),
  gsuite_email: z.string().email(),
  address: z.string(),
  dateOfBirth: z.string().date(),
  prefered_department: z.string(),
  prefered_department2: z.string(),

  blood_group: z.string(),
  hobbies: z.string(),

  joined_bracu: z.string(),
  rs_batch: z.string(),
  facebook_profile: z
    .string()
    .nonempty("Facebook profile url cannot be empty.")
    .url(),
  linkedin_profile: z.string().optional(),
  portfolio_link: z.string().optional(),
  // Add more fields here.
});

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      id: "",
      joined_bracu: "",

      gsuite_email: "",
      email: "",
      phone: "",
      address: "",

      gender: "male",
      dateOfBirth: "",
      prefered_department: "",
      prefered_department2: "",
      blood_group: "O+",
      rs_batch: "N/A",
      facebook_profile: "",
      linkedin_profile: "",
      portfolio_link: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    fetch("https://api.traction.bracurobu.com/api/applicants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: values.id,
        name: values.name,
        semester: values.joined_bracu,

        personal_email: values.email,
        bracu_email: values.gsuite_email,
        mobile: values.phone,
        address: values.address,

        bio:
          "Form Generated: \nHobbies: " +
          values.hobbies +
          "\nBlood Group:" +
          values.blood_group,

        date_of_birth: values.dateOfBirth,
        gender: values.gender,

        rs: values.rs_batch,
        preferred_departments: [values.prefered_department, values.prefered_department2],

        github_profile_link:
          values.portfolio_link == "" ? null : values.portfolio_link,
        linkedin_profile_link:
          values.linkedin_profile == "" ? null : values.linkedin_profile,
        facebook_profile_link:
          values.facebook_profile == "" ? null : values.facebook_profile,
      }),
    })
      .then((res) => {
        if (res.status == 200) {
          setIsSubmitted(true);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to submit the form. Please try again later.");
      });
  }

  return (
    <div className="w-full">
      {!isSubmitted ? (
        <div className="container mx-auto px-5 lg:px-20 pt-20">
          <h1 className="text-4xl font-bold mb-8">
            BRACU ROBU Recruitment Spring 2025
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>
                      According to your University ID card.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Id</FormLabel>
                    <FormControl>
                      <Input placeholder="23201XXX" {...field} maxLength={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="someone@gmail.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gsuite_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BRACU Gsuite Mail</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="someone@gmail.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="018XXXXXXXX"
                        {...field}
                        maxLength={11}
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="B/A, Road 1, Block A, Mirpur 1"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input placeholder="YYYY-MM-DD" {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-2 w-full">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="blood_group"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Blood Group</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-2 w-full">
                <FormField
                  control={form.control}
                  name="joined_bracu"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        In which semester did you join BRACU?
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Spring 2025"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rs_batch"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>RS Batch</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "N/A",
                            "62",
                            "63",
                            "64",
                            "65",
                            "66",
                            "67",
                            "68",
                          ].map((batch) => (
                            <SelectItem key={batch} value={batch}>
                              {batch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="prefered_department"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Preferred Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          "IT",
                          "Arts & Design",
                          "Editorial & Publications",
                          "Finance & Marketing",
                          "Event Management",
                          "Research & Project Management",
                          "Strategic Planning",
                        ].map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prefered_department2"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>2nd Preferred Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          "IT",
                          "Arts & Design",
                          "Editorial & Publications",
                          "Finance & Marketing",
                          "Event Management",
                          "Research & Project Management",
                          "Strategic Planning",
                        ].map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook_profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Profile Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.facebook.com/BRACU.Robotics.Club"
                        {...field}
                        type="url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin_profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile Link (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.linkedin.com/company/brac-university-robotics-club"
                        {...field}
                        type="url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="portfolio_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio Link (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://bracurobu.com/"
                        {...field}
                        type="url"
                      />
                    </FormControl>
                    <FormDescription>
                      Link to your GitHub, Dribble, Behance or any other
                      portfolio.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hobbies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hobbies</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Reading, Writing, Coding, etc."
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Register</Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="container mx-auto px-5 lg:px-20 py-10">
          <h1 className="text-4xl font-bold mb-2">Successfully Registered.</h1>
          <p className="text-gray-500">
            We have received your application. You'll be notified soon.
          </p>
        </div>
      )}

      <footer>
        <div className="container mx-auto px-5 lg:px-20">
          <p className="text-gray-500 py-10">
            Crafted by insomniacs from BRACU ROBU Web Dev Team 💤.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
