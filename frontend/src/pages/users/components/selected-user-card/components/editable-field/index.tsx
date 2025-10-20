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
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ) : (
    <p>
      {label}: {value}
    </p>
  );
}
