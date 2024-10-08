import React, { useRef } from "react";
import { PhoneIcon, MapPinIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { useForm, SubmitHandler } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

type Inputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Props = {};

const Contact = (props: Props) => {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const form = useRef<HTMLFormElement>(null);

  const onSubmit: SubmitHandler<Inputs> = () => {
    if (form.current) {
      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          "template_4mm0dyn",
          form.current,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        )
        .then(
          () => {
            reset();
            toast.success("Your message has been sent! Thank you.");
          },
          (error) => {
            toast.error("Failed to send the message, please try again later.");
          }
        );
    }
  };

  return (
    <div className="h-screen relative flex flex-col text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-200 dark:text-gray-700 text-2xl ">
        Contact
      </h3>
      <div className="flex flex-col xl:flex-row xl:items-center xl:gap-10 2xl:flex-col space-y-3 md:space-y-8 ">
        <h4 className="text-2xl hidden 3xl:text-white 2xl:inline-block md:text-4xl font-semibold text-center">
          Contact Me
        </h4>

        <div className="space-y-2 md:space-y-10">
          {/* <div className="flex items-center space-x-5 justify-center">
            <PhoneIcon className="text-[#CA3E47] h-7 w-7 animate-pulse" />
            <p className="text-xl md:text-2xl">+30 697 562 89 18</p>
          </div> */}

          <div className="flex items-center space-x-5 justify-center">
            <MapPinIcon className="text-[#CA3E47] h-7 w-7 animate-pulse" />
            <p className="text-xl md:text-2xl">Netherlands</p>
          </div>

          <div className="flex items-center space-x-5 justify-center">
            <EnvelopeIcon className="text-[#CA3E47] h-7 w-7 animate-pulse" />
            <p className="text-xl md:text-2xl">murathoncu@gmail.com</p>
          </div>
        </div>

        <form
          ref={form}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2 w-fit mx-auto">
          <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
            <input
              {...register("name", { required: true })}
              placeholder="Name"
              className="contactInput"
              type="text"
            />
            <input
              {...register("email", { required: true })}
              placeholder="Email"
              className="contactInput"
              type="email"
            />
          </div>
          <input
            {...register("subject", { required: true })}
            placeholder="Subject"
            className="contactInput"
            type="text"
          />

          <textarea
            {...register("message", { required: true })}
            placeholder="Message"
            className="contactInput resize-none"
          />
          <button
            type="submit"
            className="bg-[#CA3E47] dark:bg-[#414141]/90 py-2 px-4 md:py-5 md:px-10 rounded-md text-white font-bold text-md md:text-lg hover:opacity-70 transition-all duration-150">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
