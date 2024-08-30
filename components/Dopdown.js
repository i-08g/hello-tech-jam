// app/components/Dropdown.js
import { Select } from "@shadcn/ui";

export default function Dropdown() {
    const options = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
    ];

    return (
        <Select>
            {options.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                    {option.label}
                </Select.Item>
            ))}
        </Select>
    );
}