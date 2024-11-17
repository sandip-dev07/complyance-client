import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/contexts/auth-context";

interface Country {
  code: string;
  name: string;
}

// Define the list of countries
const COUNTRIES: Country[] = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
];

const CountrySelector: React.FC = () => {
  const { user, updateCountry } = useAuth();

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCountryChange = async (selectedCountry: string) => {
    setError("");

    setIsLoading(true);
    try {
      const result = await updateCountry(selectedCountry);
      if (!result.success) {
        setError(result.error || "Failed to update country");
      }
    } catch (err) {
      setError(`An unexpected error occurred- ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow">
      <label
        className="block text-sm font-medium text-gray-700 mb-2"
        htmlFor="country"
      >
        Select Country
      </label>
      <Select
        value={user?.country || ""}
        onValueChange={handleCountryChange}
        disabled={isLoading}
      >
        <SelectTrigger
        className="max-w-xs"
        >
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map(({ code, name }) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CountrySelector;
