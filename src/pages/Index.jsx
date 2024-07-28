import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const customers = [
  { value: "customer1", label: "Customer 1" },
  { value: "customer2", label: "Customer 2" },
  { value: "customer3", label: "Customer 3" },
  // Add more customers as needed
];

const Index = () => {
  const [endpoint, setEndpoint] = useState("hw-red-panda-123456");
  const [customer, setCustomer] = useState("");
  const [open, setOpen] = useState(false);
  const [monitorDataLayer, setMonitorDataLayer] = useState(false);
  const [tableRows, setTableRows] = useState([
    { sku: "SKU-4577-736", product: "Sneakers", qty: 1, price: 123456.78, discount: 4568.90 }
  ]);

  const handleReset = () => {
    setEndpoint("");
    setCustomer("");
    setMonitorDataLayer(false);
    setTableRows([{ sku: "", product: "", qty: 0, price: 0, discount: 0 }]);
  };

  const addRow = () => {
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
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
          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">Customer:</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {customer
                    ? customers.find((c) => c.value === customer)?.label
                    : "Select customer..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search customer..." />
                  <CommandEmpty>No customer found.</CommandEmpty>
                  <CommandGroup>
                    {customers.map((c) => (
                      <CommandItem
                        key={c.value}
                        onSelect={(currentValue) => {
                          setCustomer(currentValue === customer ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {c.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
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
        <Button onClick={handleReset} variant="outline" className="w-full">Reset</Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div>
                    <Input
                      value={row.sku}
                      onChange={(e) => updateRow(index, 'sku', e.target.value)}
                      placeholder="SKU"
                      className="mb-2"
                    />
                    <Input
                      value={row.product}
                      onChange={(e) => updateRow(index, 'product', e.target.value)}
                      placeholder="Product Name"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.qty}
                    onChange={(e) => updateRow(index, 'qty', parseInt(e.target.value))}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.price}
                    onChange={(e) => updateRow(index, 'price', parseFloat(e.target.value))}
                    step="0.01"
                  />
                </TableCell>
                <TableCell>
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
        <Button onClick={addRow} className="mt-4">
          <Plus className="h-4 w-4 mr-2" /> Add Row
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {["Shipping", "Handling", "Payment", "Other Discounts", "Revenue", "Cost"].map((label) => (
            <div key={label}>
              <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-700 mb-1">{label}:</label>
              <Input
                id={label.toLowerCase()}
                type="number"
                defaultValue={0}
                step="0.01"
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 mb-4">
          {["AIRMEE", "DEFAULT", "KLARNA"].map((type) => (
            <Select key={type}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={type} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={type.toLowerCase()}>{type}</SelectItem>
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      <Button className="w-full">Predict</Button>
    </div>
  );
};

export default Index;