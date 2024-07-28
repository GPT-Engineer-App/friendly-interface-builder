import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const RemoteValidatedInput = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (url) {
        validateUrl(url);
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [url]);

  const validateUrl = async (inputUrl) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/validate-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });
      setIsValid(response.status === 200);
    } catch (error) {
      console.error('Error validating URL:', error);
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="pr-10"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        {isLoading && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
        {!isLoading && isValid === true && <CheckCircle className="h-5 w-5 text-green-500" />}
        {!isLoading && isValid === false && <XCircle className="h-5 w-5 text-red-500" />}
      </div>
    </div>
  );
};

export {
    RemoteValidatedInput
};