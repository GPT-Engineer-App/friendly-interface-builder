import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ChevronsUpDown, RotateCcw } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const handleReset = () => {
    setEndpoint("");
    setCustomer("");
    setMonitorDataLayer(true);
    setTableRows([{ sku: "", product: "", qty: 0, price: 0, discount: 0 }]);
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow relative">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleReset}
                variant="outline"
                size="icon"
                className="absolute top-2 right-2"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset all fields</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-start"
                      >
                        {row.sku && row.product ? (
                          <span className="text-left">
                            {row.sku}<br />{row.product}
                          </span>
                        ) : (
                          "Select product..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search product..." />
                        <CommandEmpty>No product found.</CommandEmpty>
                        <CommandGroup>
                          {products.map((product) => (
                            <CommandItem
                              key={product.sku}
                              onSelect={() => {
                                updateRow(index, 'sku', product.sku);
                                updateRow(index, 'product', product.name);
                              }}
                            >
                              <span className="text-left">
                                {product.sku}<br />{product.name}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
        <Button onClick={addProduct} className="mt-4">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="col-span-4 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Revenue:</label>
            <Input type="number" defaultValue={0} step="0.01" className="w-full" />
          </div>
          <div className="col-span-4 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost:</label>
            <Input type="number" defaultValue={0} step="0.01" className="w-full" />
          </div>
          <div className="col-span-4 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping:</label>
            <Input type="number" defaultValue={0} step="0.01" className="w-full" />
          </div>
          <div className="col-span-4 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Handling:</label>
            <Input type="number" defaultValue={0} step="0.01" className="w-full" />
          </div>
          <div className="col-span-4 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment:</label>
            <Input type="number" defaultValue={0} step="0.01" className="w-full" />
          </div>
          <div className="col-span-4 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Other Discounts:</label>
            <Input type="number" defaultValue={0} step="0.01" className="w-full" />
          </div>
          <div className="col-span-4 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
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
        </div>
      </div>

      <Button className="w-full">Predict</Button>
    </div>
  );
};

export default Index;