interface FormInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea';
  placeholder?: string;
  required?: boolean;
}

export default function FormInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          id={id}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
