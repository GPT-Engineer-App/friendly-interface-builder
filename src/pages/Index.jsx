import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [endpoint, setEndpoint] = useState("hw-red-panda-123456");
  const [customer, setCustomer] = useState("");
  const [monitorDataLayer, setMonitorDataLayer] = useState(false);

  const handleReset = () => {
    setEndpoint("");
    setCustomer("");
    setMonitorDataLayer(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardContent className="p-6">
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
              <Input
                id="customer"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full"
              />
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
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>SKU-4577-736 Sneakers</TableCell>
                <TableCell>1</TableCell>
                <TableCell>123456</TableCell>
                <TableCell>4568</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {["Shipping", "Handling", "Payment", "Other Discounts", "Revenue", "Cost"].map((label) => (
              <div key={label}>
                <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-700 mb-1">{label}:</label>
                <Input
                  id={label.toLowerCase()}
                  type="number"
                  defaultValue={0}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
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
        </CardContent>
      </Card>

      <Button className="w-full">Predict</Button>
    </div>
  );
};

export default Index;