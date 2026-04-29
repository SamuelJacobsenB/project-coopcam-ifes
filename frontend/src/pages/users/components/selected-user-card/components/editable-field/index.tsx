import { Input } from "../../../../../../components";

interface EditableFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  editMode: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function EditableField({
  label,
  name,
  type,
  value,
  editMode,
  placeholder,
  onChange,
}: EditableFieldProps) {
  return editMode ? (
    <Input
      label={label}
      name={name}
      type={type}
      placeholder={placeholder}
      required
      value={
        type === "date"
          ? value.includes("T")
            ? value.split("T")[0]
            : value.split("/").reverse().join("-")
          : value
      }
      onChange={(e) => {
        let value;
        if (type === "date") {
          const [year, month, day] = e.target.value.split("-");
          value = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            12,
          ).toISOString();
        } else value = e.target.value;

        onChange(value);
      }}
    />
  ) : (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  );
}
