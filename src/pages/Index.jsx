import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useQuery } from "@tanstack/react-query";
import { FlashingValueDisplay } from "@/components/ui/flashing-value-display";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, RotateCcw, Sparkles, CalendarIcon, Clock, X, CheckIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, set } from "date-fns";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import 'react18-json-view/src/style.css'
import JsonView from 'react18-json-view'

const defaults = {  
  "store_market": "SE",
  "store_property": "zoo.se",
  "store_type": "online",
  "currency": "SEK",
  "shipping_method": "air-std",
  "handling_type": "unknown",
  "payment_type": "card",
  "customer_email": "niels@bosmainteractive.se",
  "customer_city": "Saltsjö-Boo",
  "customer_zip": "13239",
  "customer_country_code": "SE",
  "lines" : [
    {
      "product_id": "205666001",
      "quantity": 2,
      "unit_paid": 1566.4,
      "unit_discount": 100
    }
  ]
}

const countries = [
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "FI", label: "Finland" },
];

const Index = () => {
  const [endpoint, setEndpoint] = useState("");
  const [isEndpointSet, setIsEndpointSet] = useState(false);

  const { data: options, isLoading: isLoadingOptions, error: optionsError } = useQuery({
    queryKey: ['debuggerOptions', endpoint],
    queryFn: async () => {
      if (!endpoint) return null;
      const response = await fetch(`${endpoint}/debugger/options`);
      if (!response.ok) {
        throw new Error(`Failed to load ${endpoint}/debugger/options`);
      }
      const data = await response.json();

      return data;
    },
    enabled: !!endpoint && isEndpointSet,
  });

  //Store:
  const storeMarkets = options?.store_market_options || [];
  const [storeMarket, setStoreMarket] = useState(storeMarkets[0] || defaults.store_market);
  const storeProperties = options?.store_property_options || [];
  const [storeProperty, setStoreProperty] = useState(storeProperties[0] || defaults.store_property);
  const storeTypes = options?.store_type_options || [];
  const [storeType, setStoreType] = useState(storeTypes[0] || defaults.store_type);

  //Customer:
  const [customerId, setCustomerId] = useState("");
  const [customerEmail, setCustomerEmail] = useState(defaults.customer_email);
  const [customerCity, setCustomerCity] = useState(defaults.customer_city);
  const [customerZip, setCustomerZip] = useState(defaults.customer_zip);
  const [customerCountryCode, setCustomerCountryCode] = useState(countries[0]?.value || defaults.customer_country_code);

  //Basket:
  const [monitorDataLayer, setMonitorDataLayer] = useState(true);
  const [tableRows, setTableRows] = useState(defaults.lines);
  
  //Shipping:
  const shippingMethods = options?.shipping_method_options || [];
  const [shippingRevenue, setShippingRevenue] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [predictShippingCost, setPredictShippingCost] = useState(true);
  const [shippingMethod, setShippingMethod] = useState(shippingMethods[0] || defaults.shipping_method);

  //Handling:
  const handlingTypes = options?.handling_type_options || [];
  const [handlingRevenue, setHandlingRevenue] = useState(0);
  const [handlingCost, setHandlingCost] = useState(0);
  const [predictHandlingCost, setPredictHandlingCost] = useState(true);
  const [handlingType, setHandlingType] = useState(handlingTypes[0] || defaults.handling_type);
  
  //Payment:
  const paymentTypes = options?.payment_type_options || [];
  const [paymentRevenue, setPaymentRevenue] = useState(0);
  const [paymentCost, setPaymentCost] = useState(0);
  const [predictPaymentCost, setPredictPaymentCost] = useState(true);
  const [paymentType, setPaymentType] = useState(paymentTypes[0] || defaults.payment_type);

  //Other Discounts:
  const [otherDiscounts, setOtherDiscounts] = useState(0);
  const [otherDiscountsType, setOtherDiscountsType] = useState("");

  const [response, setResponse] = useState({});
  const [showResponse, setShowResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPredict, setAutoPredict] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const [campaignsJson, setCampaignsJson] = useState(null);
  const [showCampaignsModal, setShowCampaignsModal] = useState(false);

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("12:00");
  const [showOrderDate, setShowOrderDate] = useState(true);

  useEffect(() => {
    const storedEndpoint = localStorage.getItem('endpoint');
    if (storedEndpoint) {
      setEndpoint(storedEndpoint);
      setIsEndpointSet(true);
    }
  }, []);

  const handleReset = () => {
    setStoreMarket(storeMarkets[0] || "");
    setStoreProperty(storeProperties[0] || "");
    setStoreType(storeTypes[0] || "");

    setCustomerId("");
    setCustomerEmail(defaults.customer_email);
    setCustomerCity(defaults.customer_city);
    setCustomerZip(defaults.customer_zip);
    setCustomerCountryCode(defaults.customer_country_code);

    setMonitorDataLayer(true);
    setTableRows([{ product_id: "", quantity: 1, unit_paid: 0, unit_discount: 0 }]);

    setShippingCost(0);
    setShippingRevenue(0);
    setShippingMethod(shippingMethods[0]);
    setPredictShippingCost(true);

    setHandlingRevenue(0);
    setHandlingCost(0);
    setHandlingType(handlingTypes[0]);
    setPredictHandlingCost(true);

    setPaymentRevenue(0);  
    setPaymentCost(0);
    setPaymenetType(paymentTypes[0]);
    setPredictPaymentCost(true);

    setOtherDiscounts(0);
    setOtherDiscountsType("");

    setResponse({});
    setShowResponse(false);

    setDate(new Date());
    setTime("12:00");
    setShowOrderDate(true);
    setAutoPredict(true);
  };

  const handleClearEndpoint = () => {
    setEndpoint("");
    setIsEndpointSet(false);
    localStorage.removeItem('endpoint');
  }

  const addProduct = () => {
    setTableRows([...tableRows, { product_id: "", quantity: 1, unit_paid: 0, unit_discount: 0 }]);
  };

  const removeRow = (index) => {
    const newRows = tableRows.filter((_, i) => i !== index);
    setTableRows(newRows);
  };

  const updateRow = (index, field, value) => {
    const newRows = [...tableRows];
    newRows[index][field] = value;
    setTableRows(newRows);
  };

  const handleDateTimeChange = (newDate) => {
    setDate(newDate);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const formatDateTime = () => {
    if (!date) return "Pick a date and time";
    const dateString = format(date, "PPP");
    return `${dateString} ${time}`;
  };

  const handlePredict = async () => {
    setIsLoading(true);
    const requestData = {
      store_market: storeMarket,
      store_property: storeProperty,
      store_type: storeType,
      user_agent: navigator.userAgent,
      customer_id: null,
      customer_email: customerEmail,
      currency: defaults.currency,
      lines: tableRows,
      shipping: {
        cost: predictShippingCost ? null : shippingCost,
        revenue: shippingRevenue,
        method: shippingMethod,
        city: customerCity,
        zip: customerZip,
        country_code: customerCountryCode
      },
      handling: {
        cost: predictHandlingCost ? null : handlingCost,
        revenue: handlingRevenue,
        type: handlingType
      },
      payment: {
        cost: predictPaymentCost ? null : paymentCost,
        revenue: paymentRevenue,
        type: paymentType
      },
      otherDiscounts: otherDiscounts > 0 ? [{
        type: otherDiscountsType,
        amount: otherDiscounts
      }] : null 
    };

    try {
      const startTime = performance.now();
      const response = await fetch(endpoint + "/predict", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      const endTime = performance.now();
      const timeTaken = endTime - startTime;

      const responseData = await response.json();
      setResponse(responseData);
      setResponseTime(timeTaken);
      setShowResponse(true);
      setCampaignsJson(JSON.parse(responseData.campaigns));

    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to retrieve prediction request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetEndpoint = () => {
    if (endpoint.trim()) {
      localStorage.setItem('endpoint', endpoint);
      setIsEndpointSet(true);
    }
  };

  if (!isEndpointSet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800">Enter Headw.ai Endpoint</h2>
          <div className="space-y-2">
            <Input
              id="endpoint"
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSetEndpoint}
          >
            Set
          </Button>
        </div>
      </div>
    );
  }

  if (isLoadingOptions) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <Spinner className="w-12 h-12 mb-4" />
          <p className="text-lg font-semibold">Loading options...</p>
        </div>
      </div>
    );
  }

  if (optionsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-red-600">Error Loading Options</h2>
          <p className="text-center text-gray-700">{optionsError.message}</p>
          <Button
            className="w-full"
            onClick={() => { handleClearEndpoint(); window.location.reload(); }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">

      <h1 className="text-xl font-semibold mb-4">Headw.ai Prediction Debugger</h1>

      <div className="flex items-center space-x-2">

      <Button variant="outline" onClick={handleClearEndpoint}>
          <X className="mr-2 h-4 w-4" />
          { endpoint }
        </Button>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="icon"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset all fields</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

      </div>

      <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Store</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="market" className="block text-sm font-medium text-gray-700 mb-1">Market:</label>
            <SearchableSelect
              id="storeMarket"
              value={storeMarket}
              onChange={setStoreMarket}
              items={storeMarkets.map(m => ({ value: m, label: m }))}
              className="w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="property" className="block text-sm font-medium text-gray-700 mb-1">Property:</label>
            <SearchableSelect
              id="storeProperty"
              value={storeProperty}
              onChange={setStoreProperty}
              items={storeProperties.map(p => ({ value: p, label: p }))}
              className="w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="storeType" className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
            <SearchableSelect
              id="storeType"
              value={storeType}
              onChange={setStoreType}
              items={storeTypes.map(t => ({ value: t, label: t }))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Basket</h2>
          <div className="flex items-center space-x-2 hidden">
            <Checkbox
              id="monitorDataLayer"
              checked={monitorDataLayer}
              onCheckedChange={setMonitorDataLayer}
            />
            <label htmlFor="monitorDataLayer" className="text-sm font-medium text-gray-700">
              Mirror DataLayer
            </label>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead className="w-[20%]">Quantity</TableHead>
              <TableHead className="w-[20%]">Unit Paid</TableHead>
              <TableHead className="w-[20%]">Unit Discount</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="w-[40%]">
                  <Input
                    value={row.product_id}
                    onChange={(e) => updateRow(index, 'product_id', e.target.value)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell className="w-[20%]">
                  <Input
                    type="number"
                    value={row.quantity}
                    onChange={(e) => updateRow(index, 'quantity', parseInt(e.target.value))}
                  />
                </TableCell>
                <TableCell className="w-[20%]">
                  <Input
                    type="number"
                    value={row.unit_paid}
                    onChange={(e) => updateRow(index, 'unit_paid', parseFloat(e.target.value))}
                  />
                </TableCell>
                <TableCell className="w-[20%]">
                  <Input
                    type="number"
                    value={row.unit_discount}
                    onChange={(e) => updateRow(index, 'unit_discount', parseFloat(e.target.value))}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => removeRow(index)} variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={addProduct} className="mt-4" variant="secondary">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Customer</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <Input
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="customerCity" className="block text-sm font-medium text-gray-700 mb-1">City:</label>
            <Input
              id="customerCity"
              value={customerCity}
              onChange={(e) => setCustomerCity(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="customerZip" className="block text-sm font-medium text-gray-700 mb-1">Zip:</label>
            <Input
              id="customerZip"
              value={customerZip}
              onChange={(e) => setCustomerZip(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="customerCountryCode" className="block text-sm font-medium text-gray-700 mb-1">Country:</label>
            <SearchableSelect
              id="customerCountryCode"
              value={customerCountryCode}
              onChange={setCustomerCountryCode}
              items={countries}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col hidden">
            <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
            {showOrderDate ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="runtime"
                  checked={showOrderDate}
                  onCheckedChange={() => setShowOrderDate(false)}
                />
                <label htmlFor="runtime" className="text-sm font-medium text-gray-700">
                  Use Current Time
                </label>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateTime()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateTimeChange}
                    initialFocus
                  />
                  <div className="p-3 border-t border-gray-200">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <Input
                        type="time"
                        value={time}
                        onChange={handleTimeChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 font-medium"></th>
              <th className="text-left text-sm p-2 font-medium">Shipping</th>
              <th className="text-left text-sm p-2 font-medium">Handling</th>
              <th className="text-left text-sm p-2 font-medium">Payment</th>
              <th className="text-left text-sm p-2 font-medium">Other Discounts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 font-medium text-right text-sm">Revenue</td>
              <td className="p-2">
                <Input id="shippingRevenue" type="number" value={shippingRevenue} onChange={(e) => setShippingRevenue(parseFloat(e.target.value))} className="w-full" />
              </td>
              <td className="p-2">
                <Input id="handlingRevenue" type="number" value={handlingRevenue} onChange={(e) => setHandlingRevenue(parseFloat(e.target.value))} className="w-full" />
              </td>
              <td className="p-2">
                <Input id="paymentRevenue" type="number" value={paymentRevenue} onChange={(e) => setPaymentRevenue(parseFloat(e.target.value))} className="w-full" />
              </td>
              <td className="p-2"></td>
            </tr>
            <tr>
              <td className="p-2 font-medium text-right text-sm">Cost</td>
              <td className="p-2">
                {predictShippingCost ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="predictShippingCost"
                      checked={predictShippingCost}
                      onCheckedChange={() => setPredictShippingCost(false)}
                    />
                    <label htmlFor="predictShippingCost" className="text-sm font-medium text-gray-700">
                      Predict
                    </label>
                  </div>
                ) : (
                  <Input
                    type="number"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(parseFloat(e.target.value))}
                    className="w-full"
                  />
                )}
              </td>
              <td className="p-2">
                {predictHandlingCost ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="predictHandlingCost"
                      checked={predictHandlingCost}
                      onCheckedChange={() => setPredictHandlingCost(false)}
                    />
                    <label htmlFor="predictHandlingCost" className="text-sm font-medium text-gray-700">
                      Predict
                    </label>
                  </div>
                ) : (
                  <Input
                    type="number"
                    value={handlingCost}
                    onChange={(e) => setHandlingCost(parseFloat(e.target.value))}
                    className="w-full"
                  />
                )}
              </td>
              <td className="p-2">
                {predictPaymentCost ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="predictPaymentCost"
                      checked={predictPaymentCost}
                      onCheckedChange={() => setPredictPaymentCost(false)}
                    />
                    <label htmlFor="predictPaymentCost" className="text-sm font-medium text-gray-700">
                      Predict
                    </label>
                  </div>
                ) : (
                  <Input
                    type="number"
                    value={paymentCost}
                    onChange={(e) => setPaymentCost(parseFloat(e.target.value))}
                    className="w-full"
                  />
                )}
              </td>
              <td className="p-2">
                <Input
                  type="number" 
                  value={otherDiscounts}
                  onChange={(e) => setOtherDiscounts(parseFloat(e.target.value))}
                  className="w-full" />
              </td>
            </tr>
            <tr>
              <td className="p-2 font-medium text-right text-sm">Type</td>
              <td className="p-2">
                <SearchableSelect
                  value={shippingMethod}
                  onChange={setShippingMethod}
                  items={shippingMethods.map(m => ({ value: m, label: m }))}
                  className="w-full"
                />
              </td>
              <td className="p-2">
                <SearchableSelect
                  value={handlingType}
                  onChange={setHandlingType}
                  items={handlingTypes.map(m => ({ value: m, label: m }))}
                  className="w-full"
                />
              </td>
              <td className="p-2">
                <SearchableSelect
                  value={paymentType}
                  onChange={setPaymentType}
                  items={paymentTypes.map(m => ({ value: m, label: m }))}
                  className="w-full"
                />
              </td>
              <td className="p-2">
                <Input
                  value={otherDiscountsType}
                  onChange={(e) => setOtherDiscountsType(e.target.value)}
                  className="w-full"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center space-x-4">
        <Button onClick={handlePredict} disabled={isLoading || autoPredict}>
          {isLoading ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Predict
        </Button>
        {/* 
        <div className="flex items-center space-x-2">
          <Checkbox
            id="autoPredict"
            checked={autoPredict}
            onCheckedChange={setAutoPredict}
          />
          <label htmlFor="autoPredict" className="text-sm font-medium text-gray-700">
            Auto
          </label>
        </div> 
        */}
      </div>

      { showResponse && ( 
        <div className="flex space-x-4">
          <div className="w-64 bg-white">
            <table className="w-full">
              <tbody>
                <tr className="bg-gray-50">
                  <td className="p-3 text-sm font-medium">
                    <button
                      onClick={() => setShowCampaignsModal(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Kickbacks
                    </button>
                  </td>
                  <td className="p-3 text-sm text-right">
                    <FlashingValueDisplay value={response.units_kickback} formatValue={(v) => `${v.toFixed(2)}`} />
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-medium">PLTV</td>
                  <td className="p-3 text-sm text-right">
                    n/a
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-64 bg-white">
            <table className="w-full">
              <tbody>
                <tr className="bg-gray-50">
                  <td className="p-3 text-sm font-medium">Cogs</td>
                  <td className="p-3 text-sm text-right">
                    <FlashingValueDisplay value={response.units_cost} formatValue={(v) => `${v.toFixed(2)}`} />
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-medium">Shipping</td>
                  <td className="p-3 text-sm text-right">
                    <FlashingValueDisplay value={response.predicted_shipping_cost} formatValue={(v) => `${v.toFixed(2)}`} />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 text-sm font-medium">Handling</td>
                  <td className="p-3 text-sm text-right">
                    <FlashingValueDisplay value={response.predicted_handling_cost} formatValue={(v) => `${v.toFixed(2)}`} />
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-medium">Payment</td>
                  <td className="p-3 text-sm text-right">
                    <FlashingValueDisplay value={response.predicted_payment_cost} formatValue={(v) => `${v.toFixed(2)}`} />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 text-sm font-medium">Refunds</td>
                  <td className="p-3 text-sm text-right">
                    n/a
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-64 bg-white">
            <table className="w-full">
              <tbody>
              <tr className="bg-gray-50">
                  <td className="p-3 text-sm font-medium">Gross Sales</td>
                  <td className="p-3 text-sm text-right">
                    <FlashingValueDisplay value={response.gross_sales} formatValue={(v) => `${v.toFixed(2)}`} />
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-medium">GP1</td>
                  <td className="p-3 text-sm text-right">
                    <FlashingValueDisplay value={response.gp1} formatValue={(v) => `${v.toFixed(2)}`} />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 text-sm font-medium">GM1</td>
                  <td className="p-3 text-sm text-right">
                    <FlashingValueDisplay value={response.gm1} formatValue={(v) => `${(v*100).toFixed(2)}%`} />
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-medium">GP2</td>
                  <td className="p-3 text-sm text-right">
                    <FlashingValueDisplay value={response.gp2} formatValue={(v) => `${v.toFixed(2)}`} />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 text-sm font-medium">GM2</td>
                  <td className="p-3 text-sm text-right">
                    <FlashingValueDisplay value={response.gm2} formatValue={(v) => `${(v*100).toFixed(2)}%`} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-64 bg-white">
            <table className="w-full">
              <tbody>
                <tr className="bg-gray-50">
                  <td className="p-3 text-sm font-medium">Response Time</td>
                  <td className="p-3 text-sm text-right">
                    {(responseTime/1000.0).toFixed(0)}s
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-medium">Total Weight</td>
                  <td className="p-3 text-sm text-right">
                    {response.total_grams.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={showCampaignsModal} onOpenChange={setShowCampaignsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Campaigns</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-auto">
            {campaignsJson ? (
              <JsonView src={campaignsJson} />
            ) : (
              <p>No campaigns data available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Index;
