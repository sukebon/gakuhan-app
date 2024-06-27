import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { CreateStudent } from "@/utils/schemas";

interface Props {
  form: UseFormReturn<CreateStudent, any, undefined>;
}

export default function GenderSelect({ form }: Props) {
  const genders: { id: "man" | "woman"; label: string; }[] = [
    {
      id: "man",
      label: "男性",
    },
    {
      id: "woman",
      label: "女性",
    },
  ];

  return (
    <div>
      <Label>性別</Label>
      <div className="flex gap-3 mt-2">
        {genders.map((gender) => (
          <Button
            key={gender.id}
            type="button"
            variant="outline"
            className={cn(
              form.watch("gender") === gender.id
                ? "border-2 border-primary"
                : "",
              "w-24 h-12"
            )}
            // asChild
            onClick={() => form.setValue("gender", gender.id, { shouldValidate: true })}
          >
            <div>{gender.label}</div>
          </Button>
        ))}
      </div>
      {form.formState.errors.gender && <div className="text-red-500 text-xs mt-2">性別を選択してください</div>}
    </div>
  );
}
