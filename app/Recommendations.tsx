"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { IPromptFormContext } from "./PromptFormProvider";
import { Loader } from "@/assets/Icons";

interface IPromptData {
  label: string;
  question: string;
  promptSuggestions: string[];
}

export const Recommendations = () => {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<Partial<IPromptFormContext["data"]>>(
    {}
  );
  const [recommendation, setRecommendation] = useState("");

  const handleSubmit = async (data: Partial<IPromptFormContext["data"]>) => {
    if (formStep < promptData.length) {
      setFormData({
        ...formData,
        ...data,
      });
      setFormStep(formStep + 1);
    } else {
      const res = await fetch(
        `https://giftwise-backend-production.up.railway.app/search?ocassion=${formData.ocassion}&preferences=${formData.preferences}&recipientRelationShip=${formData.recipientRelationShip}&recipientLocation=${data.recipientLocation}`
      );
      const responseData = await res.json();
      setRecommendation(responseData?.choices[0]?.text);
    }
  };

  const renderForm = () => {
    switch (formStep) {
      case 1:
        return <PromptForm data={promptData[0]} onSubmit={handleSubmit} />;
      case 2:
        return <PromptForm data={promptData[1]} onSubmit={handleSubmit} />;
      case 3:
        return <PromptForm data={promptData[2]} onSubmit={handleSubmit} />;
      case 4:
        return <PromptForm data={promptData[3]} onSubmit={handleSubmit} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full font-rubik">
      <div className="max-w-2xl w-11/12 space-y-2">
        <h1 className="text-4xl font-bold text-white text-left w-full">
          Ask Giftwise
        </h1>
        {recommendation ? (
          <div>
            <h3 className="pb-2">Here are some recommendations:</h3>
            <p className="rounded-lg py-3 px-5 bg-white w-full text-gray-500 whitespace-pre-wrap pb-12 break-all">
              {recommendation}
            </p>
            <button
              className="mt-8 flex items-center justify-center w-full border border-white rounded-lg text-white py-2 px-4"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : (
          <>{renderForm()}</>
        )}
      </div>
    </div>
  );
};

const PromptForm = ({
  data,
  onSubmit,
}: {
  data: IPromptData;
  onSubmit: (data: Partial<IPromptFormContext["data"]>) => void;
}) => {
  const methods = useForm();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitSuccessful, isSubmitting },
  } = methods;

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  const textLength = watch(data.label)?.length || 0;

  return (
    <div>
      <FormProvider {...methods}>
        <form
          className="flex flex-col relative"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="pb-2 font-medium text-md text-white">
            {data.question}
          </h3>
          <input
            type="text"
            id={data.label}
            {...register(data.label, { required: true })}
            placeholder="Type here..."
            className="rounded-lg py-3 px-5 bg-white w-full text-gray-500 font-light placeholder:text-gray-300"
            maxLength={120}
          />
          <div className="absolute bottom-14 right-1 text-sm">
            {textLength}/120
          </div>
          <button
            className={`rounded-lg py-2 px-4 mt-9 border border-white text-white bg-black bg-opacity-5 ${
              isSubmitting ? "cursor-not-allowed pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center space-x-2 w-full justify-center">
              <p>Next</p>
              {isSubmitting && <Loader />}
            </div>
          </button>
        </form>
        <div className="w-full pt-8 pb-2 font-medium text-md pl-2">
          suggestions:
        </div>
        <PromptSuggestions
          suggestions={data.promptSuggestions}
          name={data.label}
        />
      </FormProvider>
    </div>
  );
};

const PromptSuggestions = ({
  suggestions,
  name,
}: {
  suggestions: string[];
  name: string;
}) => {
  const { setValue, watch } = useFormContext();
  const preferences = watch("preferences");

  const setPromptValue = (value: string) => {
    if (name === "preferences") {
      if (!preferences) {
        setValue(name, value);
      } else if (!preferences.includes(value)) {
        setValue(name, [preferences, value].join(", "));
      }
      return;
    }
    setValue(name, value);
  };

  return (
    <div className="flex w-full flex-wrap">
      {suggestions.map((suggestion, index) => (
        <button
          className={`py-2 px-4 m-2 cursor-pointer rounded-full ${
            index % 2 === 0 ? "bg-violet-400" : "bg-pink-300"
          }`}
          onClick={() => setPromptValue(suggestion)}
          key={suggestion}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

const promptData = [
  {
    label: "ocassion",
    question: "what is the occasion?",
    promptSuggestions: ["valentine's day", "birthday", "anniversary"],
  },
  {
    label: "recipientRelationShip",
    question: "who is it for?",
    promptSuggestions: ["girlfriend", "boyfriend", "husband", "wife", "friend"],
  },
  {
    label: "preferences",
    question: "what are their hobbies, interests and other particular details?",
    promptSuggestions: [
      "shopping",
      "travelling",
      "good fashion sense",
      "cooking",
      "cafe hopping",
      "reading",
      "gaming",
      "music",
      "art",
      "fond of apparels",
      "photography",
      "sports",
      "movies and tv shows",
      "fond of gadgets",
      "fitness",
    ],
  },
  {
    label: "recipientLocation",
    question: "where is the recipient located?",
    promptSuggestions: ["india", "new york", "canada", "paris", "berlin"],
  },
];
