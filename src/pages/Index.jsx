import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, RotateCcw, Sparkles, CalendarIcon, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const customers = [
  { value: "customer1", label: "Customer 1" }, 
  { value: "customer2", label: "Customer 2" },
  { value: "customer3", label: "Customer 3" },
  // Add more customers as needed
];

const products = [
  { sku: "SKU-4577-736", name: "Sneakers" },
  { sku: "SKU-1234-567", name: "T-Shirt" },
  { sku: "SKU-8901-234", name: "Jeans" },
  { sku: "SKU-5678-901", name: "Jacket" },
  // Add more products as needed
];

const Index = () => {
  const [endpoint, setEndpoint] = useState("hw-red-panda-123456");
  const [customer, setCustomer] = useState("");
  const [open, setOpen] = useState(false);
  const [monitorDataLayer, setMonitorDataLayer] = useState(true);
  const [tableRows, setTableRows] = useState([
    { sku: "SKU-4577-736", product: "Sneakers", qty: 1, price: 123456.78, discount: 4568.90 }
  ]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("12:00");

  const handleReset = () => {
    setEndpoint("");
    setCustomer("");
    setMonitorDataLayer(true);
    setTableRows([{ sku: "", product: "", qty: 0, price: 0, discount: 0 }]);
    setDate(new Date());
    setTime("12:00");
  };

  const addProduct = () => {
    setTableRows([...tableRows, { sku: "", product: "", qty: 0, price: 0, discount: 0 }]);
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

  return (
    <div className="container mx-auto p-6 space-y-6">

      <div className="bg-white p-6 rounded-lg shadow relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="bg-white p-6 rounded-lg shadow relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-1">Endpoint:</label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">Customer:</label>
            <Input
              id="customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1">Date and Time:</label>
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
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Basket</h2>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="monitorDataLayer"
              checked={monitorDataLayer}
              onCheckedChange={setMonitorDataLayer}
            />
            <label htmlFor="monitorDataLayer" className="text-sm font-medium text-gray-700">
              Monitor DataLayer
            </label>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead className="w-[20%]">Qty</TableHead>
              <TableHead className="w-[20%]">Price</TableHead>
              <TableHead className="w-[20%]">Discount</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="w-[40%]">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="AIRMEE" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airmee">AIRMEE</SelectItem>
                      <SelectItem value="default">DEFAULT</SelectItem>
                      <SelectItem value="klarna">KLARNA</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="w-[20%]">
                  <Input
                    type="number"
                    value={row.qty}
                    onChange={(e) => updateRow(index, 'qty', parseInt(e.target.value))}
                  />
                </TableCell>
                <TableCell className="w-[20%]">
                  <Input
                    type="number"
                    value={row.price}
                    onChange={(e) => updateRow(index, 'price', parseFloat(e.target.value))}
                    step="0.01"
                  />
                </TableCell>
                <TableCell className="w-[20%]">
                  <Input
                    type="number"
                    value={row.discount}
                    onChange={(e) => updateRow(index, 'discount', parseFloat(e.target.value))}
                    step="0.01"
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

      <div className="w-full  mx-auto p-4 bg-white shadow-md rounded-lg">
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
                <Input type="number" defaultValue={0} step="0.01" className="w-full" />
              </td>
              <td className="p-2">
                <Input type="number" defaultValue={0} step="0.01" className="w-full" />
              </td>
              <td className="p-2">
                <Input type="number" defaultValue={0} step="0.01" className="w-full" />
              </td>
              <td className="p-2"></td>
            </tr>
            <tr>
              <td className="p-2 font-medium text-right text-sm">Cost</td>
              <td className="p-2">
                <Input type="number" defaultValue={0} step="0.01" className="w-full" />
              </td>
              <td className="p-2">
                <Input type="number" defaultValue={0} step="0.01" className="w-full" />
              </td>
              <td className="p-2">
                <Input type="number" defaultValue={0} step="0.01" className="w-full" />
              </td>
              <td className="p-2">
                <Input type="number" defaultValue={0} step="0.01" className="w-full" />
              </td>
            </tr>
            <tr>
              <td className="p-2 font-medium text-right text-sm">Type</td>
              <td className="p-2">
                <div className="relative">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="AIRMEE" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airmee">AIRMEE</SelectItem>
                      <SelectItem value="default">DEFAULT</SelectItem>
                      <SelectItem value="klarna">KLARNA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </td>
              <td className="p-2">
                <div className="relative">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="AIRMEE" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airmee">AIRMEE</SelectItem>
                      <SelectItem value="default">DEFAULT</SelectItem>
                      <SelectItem value="klarna">KLARNA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </td>
              <td className="p-2">
                <div className="relative">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="AIRMEE" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airmee">AIRMEE</SelectItem>
                      <SelectItem value="default">DEFAULT</SelectItem>
                      <SelectItem value="klarna">KLARNA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </td>
              <td className="p-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <Button>
        <Sparkles className="mr-2 h-4 w-4"/> Predict
      </Button>

    </div>
  );
};

export default Index;