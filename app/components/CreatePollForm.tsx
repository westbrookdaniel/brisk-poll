import * as React from "react";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { Button } from "~/components/common/button";
import { FormInput, FormError } from "~/components/common/form";
import type { ActionData } from "~/routes";

export default function CreatePollForm() {
  const actionData = useActionData() as ActionData | undefined;
  const transition = useTransition();

  const [optionCount, setOptionCount] = React.useState(2);

  return (
    <Form method="post">
      <fieldset
        className="space-y-4"
        disabled={transition.state === "submitting"}
      >
        <FormInput
          aria-label="Poll title"
          placeholder="What is the title of your poll?"
          name="title"
          error={actionData?.errors?.title}
        />

        <fieldset className="flex flex-col space-y-2">
          {new Array(optionCount).fill(null).map((_, i) => (
            <FormInput
              aria-label={`Option ${i + 1}`}
              placeholder={`Label for option ${i + 1}`}
              name="option"
              // Autofocus on newly added options
              autoFocus={optionCount > 0 ? optionCount === i + 1 : false}
              error={!!actionData?.errors?.option}
              key={i}
            />
          ))}
          <FormError name="option" error={actionData?.errors?.option} />
          <Button
            type="button"
            onClick={() => setOptionCount((o) => o + 1)}
            variant="ghost"
            className="self-end"
          >
            + Add Option
          </Button>
        </fieldset>

        <Button type="submit" className="w-full">
          {transition.state === "submitting" ? "Creating Poll" : "Create Poll"}
        </Button>
      </fieldset>
    </Form>
  );
}
