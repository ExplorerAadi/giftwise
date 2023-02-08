"use client";

import { useEffect, useState } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
import { IPromptFormContext } from "./PromptFormProvider";
import { Loader } from "@/assets/Icons";
import { RadioGroup } from "@headlessui/react";
import { classNames, URLify } from "@/utils";
import getSymbolFromCurrency from "currency-symbol-map";

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
        `https://giftwise-backend-production.up.railway.app/search?ocassion=${formData.ocassion}&preferences=${formData.preferences}&recipientRelationShip=${formData.recipientRelationShip}&budget=${data.budget}`
      );
      const responseData = await res.json();
      setRecommendation(URLify(responseData?.choices[0]?.text || ""));
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
        return (
          <PromptBudgetForm data={promptData[3]} onSubmit={handleSubmit} />
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full font-rubik pt-8 sm:p-0">
      <div className="max-w-2xl w-11/12 space-y-10">
        <div className="flex items-end justify-center">
          <div className="justify-self-center w-full space-y-1">
            <h1 className="text-3xl font-medium text-white text-left w-full">
              Ask Giftwise
            </h1>
            <p className="text-sm">for personalised gift recommendations</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="./gift.png" className="w-44 sm:w-72 -mr-2" alt="" />
        </div>
        {recommendation ? (
          <div>
            <p
              className="rounded-lg py-3 px-5 bg-black bg-opacity-40 w-full whitespace-pre-wrap pb-12 break-word max-h-[500px] overflow-y-auto text-gray-100 font-sans text-sm recommendation"
              dangerouslySetInnerHTML={{ __html: recommendation }}
            ></p>
            <button
              onClick={() => window.location.reload()}
              className={classNames(
                "rounded-lg py-2 px-4 bg-white text-black mt-6 w-full"
              )}
            >
              <div className="flex items-center space-x-2 w-full justify-center">
                Try again
              </div>
            </button>
          </div>
        ) : (
          <div className="border border-violet-700 px-4 sm:p-8 py-8 rounded-md">
            {renderForm()}
          </div>
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
          <h3 className="pb-2 text-md text-white">{data.question}</h3>
          <input
            type="text"
            id={data.label}
            {...register(data.label, { required: true })}
            placeholder="Type here..."
            className="rounded-lg py-3 px-5 bg-black bg-opacity-50 w-full placeholder:text-gray-300 font-light text-white"
            maxLength={120}
          />
          <div className="absolute bottom-[56px] sm:bottom-14 right-1 text-sm">
            {textLength}/120
          </div>
          <button
            className={classNames(
              isSubmitting ? "cursor-not-allowed pointer-events-none" : "",
              "rounded-lg py-2 px-4 mt-9 bg-white text-black"
            )}
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

const PromptBudgetForm = ({
  data,
  onSubmit,
}: {
  data: IPromptData;
  onSubmit: (data: Partial<IPromptFormContext["data"]>) => void;
}) => {
  const methods = useForm();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="font-medium text-md text-white">{data.question}</h3>
        <Controller
          control={control}
          name="budget"
          render={({ field: { onChange, value } }) => (
            <RadioGroup value={value} onChange={onChange}>
              <div className="flex flex-wrap mt-2">
                {data.promptSuggestions.map((suggestion) => (
                  <RadioGroup.Option
                    key={suggestion}
                    value={suggestion}
                    className={({ checked }) =>
                      classNames(
                        checked ? "bg-white text-violet-800" : "",
                        "flex items-center rounded-full border border-white m-2 px-6 py-2 cursor-pointer max-w-max"
                      )
                    }
                  >
                    <span>{suggestion}</span>
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          )}
        />
        <button
          className={classNames(
            isSubmitting ? "cursor-not-allowed pointer-events-none" : "",
            "rounded-lg py-2 px-4 bg-white text-black mt-6"
          )}
        >
          <div className="flex items-center space-x-2 w-full justify-center">
            <p>Next</p>
            {isSubmitting && <Loader />}
          </div>
        </button>
      </form>
    </FormProvider>
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
  const preferences: string = watch("preferences");
  const inputValue = watch(name);

  const setPromptValue = (value: string) => {
    if (name === "preferences") {
      let preferencesArr = preferences?.split(", ") || [];
      if (!preferences) {
        preferencesArr = [value];
      } else if (!preferencesArr.includes(value)) {
        preferencesArr.push(value);
      } else if (preferences.includes(value)) {
        preferencesArr.splice(preferencesArr.indexOf(value), 1);
      }
      console.log(preferencesArr);
      setValue(name, preferencesArr.join(", "));
      return;
    }
    setValue(name, value);
  };

  return (
    <div className="w-full flex-wrap h-56 overflow-y-auto">
      {suggestions.map((suggestion) => {
        return (
          <button
            className={classNames(
              "py-2 px-4 m-2 cursor-pointer rounded-full border border-white",
              inputValue?.includes(suggestion) ? "bg-white text-violet-900" : ""
            )}
            onClick={() => setPromptValue(suggestion)}
            key={suggestion}
          >
            {suggestion}
          </button>
        );
      })}
    </div>
  );
};

const currency = getSymbolFromCurrency("INR");

const promptData = [
  {
    label: "ocassion",
    question: "What is the occasion?",
    promptSuggestions: ["valentine's day", "birthday", "anniversary"],
  },
  {
    label: "recipientRelationShip",
    question: "Who is it for?",
    promptSuggestions: ["girlfriend", "boyfriend", "husband", "wife", "bestie"],
  },
  {
    label: "preferences",
    question: "What are their hobbies, interests and other particular details?",
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
    label: "budget",
    question: `What is your budget?`,
    promptSuggestions: [
      `under ${currency}1000`,
      `${currency}4000+`,
      `${currency}1000 - ${currency}4000`,
    ],
  },
];
