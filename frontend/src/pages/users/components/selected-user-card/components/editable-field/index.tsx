import { Input } from "../../../../../../components";
import { formatDateForInput, normalizeDate } from "../../../../../../utils";

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
  const displayValue = type === "date" ? formatDateForInput(value) : value;

  return editMode ? (
    <Input
      label={label}
      name={name}
      type={type}
      placeholder={placeholder}
      required
      value={displayValue}
      onChange={(e) => {
        const val = e.target.value;
        if (type === "date") {
          onChange(normalizeDate(val));
        } else {
          onChange(val);
        }
      }}
    />
  ) : (
    <p>
      <strong>{label}:</strong>{" "}
      {type === "date" ? new Date(value).toLocaleDateString("pt-BR") : value}
    </p>
  );
}
